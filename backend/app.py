import os
import io
import pandas as pd
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from sentiment import analyzer

app = Flask(__name__)

# Configure Flask-CORS for React dev server & local execution
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "Backend is running",
        "service": "FeedSense AI API",
        "model": "Hugging Face / VADER NLP Engine"
    }), 200


@app.route("/api/analyze", methods=["POST"])
def analyze_feedback():
    """
    Accepts JSON body:
    {
      "feedback": ["text 1", "text 2", ...]
    }
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data or "feedback" not in data:
            return jsonify({"error": "Missing 'feedback' field in request body"}), 400

        feedback_items = data.get("feedback", [])
        if not isinstance(feedback_items, list):
            return jsonify({"error": "'feedback' must be a list of strings"}), 400

        # Filter out empty or whitespace strings
        cleaned_items = [str(item).strip() for item in feedback_items if str(item).strip()]
        if not cleaned_items:
            return jsonify({"error": "Feedback list cannot be empty"}), 400

        result = analyzer.analyze_batch(cleaned_items)
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error during analysis: {e}")
        return jsonify({"error": "An error occurred during sentiment analysis.", "details": str(e)}), 500


@app.route("/api/analyze-csv", methods=["POST"])
def analyze_csv():
    """
    Accepts multipart/form-data with file under key 'file' or 'csv'.
    """
    try:
        if "file" not in request.files and "csv" not in request.files:
            return jsonify({"error": "No CSV file uploaded. Key 'file' or 'csv' expected."}), 400

        file = request.files.get("file") or request.files.get("csv")
        if not file or file.filename == "":
            return jsonify({"error": "No file selected for upload."}), 400

        if not file.filename.lower().endswith(".csv"):
            return jsonify({"error": "Invalid file format. Please upload a valid .csv file."}), 400

        # Read CSV with pandas
        try:
            df = pd.read_csv(file)
        except Exception as e:
            return jsonify({"error": f"Failed to parse CSV file. Ensure it is a valid CSV: {str(e)}"}), 400

        if df.empty:
            return jsonify({"error": "The uploaded CSV file is empty."}), 400

        # Column validation: search for 'feedback' or 'text' or first string column
        feedback_column = None
        for col in df.columns:
            if col.strip().lower() in ["feedback", "text", "comment", "review", "entry", "message"]:
                feedback_column = col
                break

        if not feedback_column:
            # Fallback to first object/string column if 'feedback' column name not found
            for col in df.columns:
                if df[col].dtype == "object":
                    feedback_column = col
                    break

        if not feedback_column:
            return jsonify({
                "error": "Missing required column in CSV. Please ensure the CSV contains a column named 'feedback'."
            }), 400

        feedback_list = df[feedback_column].dropna().astype(str).tolist()
        cleaned_list = [t.strip() for t in feedback_list if t.strip()]

        if not cleaned_list:
            return jsonify({"error": "No non-empty feedback entries found in the selected CSV column."}), 400

        result = analyzer.analyze_batch(cleaned_list)
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error during CSV analysis: {e}")
        return jsonify({"error": "An error occurred while processing the CSV file.", "details": str(e)}), 500


@app.route("/api/export-pdf", methods=["POST"])
def export_pdf():
    """
    Generates a simple, clean PDF summary report using ReportLab.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        data = request.get_json(force=True, silent=True) or {}
        summary = data.get("summary", {})
        results = data.get("results", [])
        insights = data.get("insights", [])

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=12
        )
        sub_style = ParagraphStyle(
            "ReportSubtitle",
            parent=styles["Normal"],
            fontSize=11,
            textColor=colors.HexColor("#64748b"),
            spaceAfter=20
        )
        heading_style = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=12,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            "BodyTextCustom",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155")
        )

        elements = []

        # Header Title
        elements.append(Paragraph("FeedSense AI – Executive Sentiment Summary", title_style))
        elements.append(Paragraph("Automated AI Feedback Sentiment Analysis & Insights Report", sub_style))

        # Metrics Table
        metrics_data = [
            ["Metric", "Value"],
            ["Total Analyzed Feedback", str(summary.get("total", 0))],
            ["Positive Feedback", f"{summary.get('positive_count', 0)} ({summary.get('positive_pct', 0)}%)"],
            ["Negative Feedback", f"{summary.get('negative_count', 0)} ({summary.get('negative_pct', 0)}%)"],
            ["Neutral Feedback", f"{summary.get('neutral_count', 0)} ({summary.get('neutral_pct', 0)}%)"],
            ["Overall Dominant Sentiment", str(summary.get("overall_sentiment", "N/A"))],
            ["Average Confidence Score", f"{summary.get('avg_confidence', 0)}%"]
        ]
        t = Table(metrics_data, colWidths=[240, 240])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2563eb")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 15))

        # Insights Section
        elements.append(Paragraph("Key AI Insights", heading_style))
        for ins in insights:
            elements.append(Paragraph(f"• {ins}", body_style))
            elements.append(Spacer(1, 4))

        elements.append(Spacer(1, 15))

        # Sample Breakdown Table (Top 10 entries)
        elements.append(Paragraph("Sample Analyzed Feedback (Top Entries)", heading_style))
        table_rows = [["#", "Feedback Text", "Sentiment", "Confidence"]]
        for r in results[:15]:
            table_rows.append([
                str(r.get("id", "")),
                Paragraph(r.get("text", "")[:80] + ("..." if len(r.get("text", "")) > 80 else ""), body_style),
                r.get("sentiment", ""),
                f"{r.get('confidence', 0)}%"
            ])

        res_table = Table(table_rows, colWidths=[30, 290, 80, 80])
        res_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(res_table)

        doc.build(elements)
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name="feedsense_ai_report.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        app.logger.error(f"Error exporting PDF: {e}")
        return jsonify({"error": "Failed to generate PDF report", "details": str(e)}), 500


if __name__ == "__main__":
    print("Starting FeedSense AI Flask Backend on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)

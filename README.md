🤖 SmartFeedback AI – Sentiment Analysis Tool

Turn Feedback into Actionable Insights

A full-stack AI-powered web application that automatically analyzes student, customer, and employee feedback using a real NLP sentiment analysis model. The system classifies feedback as Positive, Negative, or Neutral and provides an interactive analytics dashboard with charts, insights, and export features.

📌 Problem Statement

Colleges, institutions, and small businesses collect a large amount of written feedback from students, customers, and employees. Manually reading and analyzing every response is time-consuming and often causes important negative feedback to be overlooked.

The objective is to build a web-based application that automatically analyzes multiple feedback entries, classifies sentiments as Positive, Negative, or Neutral, highlights critical feedback, and presents meaningful insights through an interactive dashboard.

💡 Proposed Solution

SmartFeedback AI is a full-stack AI application that uses a Hugging Face Transformer model to perform real-time sentiment analysis.

The application allows users to:

Enter multiple feedback entries manually.

Upload CSV files for bulk analysis.

Analyze sentiments using AI.

View an interactive dashboard with charts.

Highlight important negative feedback.

Generate AI-powered insights.

Export analyzed results as CSV.

This solution helps institutions and organizations quickly understand user opinions and make data-driven decisions.

✨ Features

AI-Based Sentiment Analysis

Manual Multiple Feedback Input

Bulk CSV Upload

Interactive Dashboard

Dynamic Pie & Bar Charts

Confidence Score for Every Feedback

Needs Attention Section

Positive Highlights

AI Insights

Common Topics Detection

CSV Export

Responsive Design

Light & Dark Mode

🛠 Technology Stack

Category

	

Technology




Frontend

	

React.js, Vite




Styling

	

Tailwind CSS




Charts

	

Recharts




Icons

	

Lucide React




Backend

	

Python, Flask




API

	

Flask-CORS




AI/NLP

	

Hugging Face Transformers




Data Processing

	

Pandas




Storage

	

SQLite (Optional)




File Format

	

CSV, JSON

📂 Project Structure
smartfeedback-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── sentiment.py
│   ├── requirements.txt
│   └── sample_feedback.csv
│
├── README.md
└── .gitignore
🏗 System Architecture
🔄 Application Workflow

User enters feedback or uploads a CSV file.

React frontend sends the data to the Flask backend.

Flask processes the feedback using a Hugging Face sentiment model.

Each feedback receives a sentiment label and confidence score.

Results are displayed in an interactive dashboard.

Users can export analyzed results as CSV.

🚀 Installation
Backend Setup
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py

Backend runs at:

http://127.0.0.1:5000
Frontend Setup
cd frontend

npm install

npm run dev

Frontend runs at:

http://localhost:5173
📤 Sample CSV Format
feedback
"The food quality was excellent."
"The service was very poor."
"The classroom was okay."
"Staff were friendly and helpful."
🔌 API Endpoints

Method

	

Endpoint

	

Purpose




GET

	

/api/health

	

Backend Status




POST

	

/api/analyze

	

Analyze Manual Feedback




POST

	

/api/analyze-csv

	

Analyze Uploaded CSV

📊 Example Output

Feedback

	

Sentiment

	

Confidence




The food was excellent

	

Positive

	

96%




Service was terrible

	

Negative

	

94%




The experience was okay

	

Neutral

	

72%

🎯 Future Enhancements

PDF Report Generation

Multi-language Sentiment Analysis

User Authentication

Cloud Deployment

Feedback Trend Analysis

Advanced Admin Dashboard

👨‍💻 Team Members

Name

	

Register Number




Divya V

	

73152413049




Dharanipriya S

	

73152413043




Bharanidharan R

	

73152413024
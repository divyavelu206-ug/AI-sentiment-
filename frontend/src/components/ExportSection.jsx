import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check, Loader2 } from 'lucide-react';
import { downloadPDFReport } from '../services/api';

export default function ExportSection({ analysisData }) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);

  if (!analysisData || !analysisData.results) return null;

  const handleDownloadCSV = () => {
    try {
      const headers = ['Feedback', 'Sentiment', 'Confidence'];
      const rows = analysisData.results.map(r => [
        `"${r.text.replace(/"/g, '""')}"`,
        `"${r.sentiment}"`,
        `"${r.confidence}%"`
      ]);

      const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'feedsense_analyzed_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCsvSuccess(true);
      setTimeout(() => setCsvSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to export CSV:', e);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      await downloadPDFReport(analysisData);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-400" />
          Export Analysis & Reports
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Download analyzed sentiment dataset in CSV format or print an executive PDF report.
        </p>
      </div>

      <div className="flex items-center space-x-3 w-full md:w-auto">
        <button
          onClick={handleDownloadCSV}
          className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 transition-colors flex items-center justify-center space-x-2"
        >
          {csvSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>CSV Downloaded!</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Download CSV</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {downloadingPDF ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-indigo-200" />
              <span>Download Report (PDF)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

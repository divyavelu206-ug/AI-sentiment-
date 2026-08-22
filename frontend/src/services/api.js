// API Base URL - uses Vite Proxy (/api) or direct localhost (http://127.0.0.1:5000/api)
const API_BASE_URL = window.location.origin.includes('5173') ? '/api' : 'http://127.0.0.1:5000/api';

/**
 * Checks backend health status
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (error) {
    // Retry with direct localhost URL if proxy fails
    try {
      const fallbackRes = await fetch('http://127.0.0.1:5000/api/health');
      if (!fallbackRes.ok) throw new Error('Direct health check failed');
      return await fallbackRes.json();
    } catch (fallbackErr) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

/**
 * Sends array of feedback strings for AI sentiment analysis
 * @param {Array<string>} feedbackList 
 */
export async function analyzeFeedback(feedbackList) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback: feedbackList }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze feedback.');
    }
    return data;
  } catch (error) {
    // Fallback to direct localhost URL if proxy fails
    try {
      const fallbackRes = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackList }),
      });
      const fallbackData = await fallbackRes.json();
      if (!fallbackRes.ok) throw new Error(fallbackData.error || 'Direct analysis failed.');
      return fallbackData;
    } catch (fallbackErr) {
      console.error('Analyze feedback error:', error);
      throw error;
    }
  }
}

/**
 * Uploads CSV file for backend sentiment analysis
 * @param {File} file 
 */
export async function analyzeCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/analyze-csv`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to process CSV file.');
    }
    return data;
  } catch (error) {
    console.error('CSV upload analysis error:', error);
    throw error;
  }
}

/**
 * Calls backend to generate downloadable PDF report
 * @param {Object} analysisData 
 */
export async function downloadPDFReport(analysisData) {
  try {
    const res = await fetch(`${API_BASE_URL}/export-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to export PDF report');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedsense_ai_report.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download PDF report error:', error);
    throw error;
  }
}

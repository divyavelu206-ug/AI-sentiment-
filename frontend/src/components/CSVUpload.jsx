import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertTriangle, Download, Cpu, X, FileSpreadsheet, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CSVUpload({ onUploadCSV, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [detectedColumn, setDetectedColumn] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setErrorMsg(null);
    setPreviewRows([]);
    setRowCount(0);
    setDetectedColumn(null);

    if (!file) return;

    // JavaScript method is endsWith (capital S)
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Invalid file format. Please select a valid .csv file.');
      return;
    }

    if (file.size === 0) {
      setErrorMsg('The selected CSV file is empty (0 bytes).');
      return;
    }

    setSelectedFile(file);

    // Client-side CSV preview reader
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);

        if (lines.length <= 1) {
          setErrorMsg('The uploaded CSV file contains no data rows.');
          return;
        }

        // Header check
        const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
        const targetCol = headers.find(h => ['feedback', 'text', 'comment', 'review', 'message'].includes(h.toLowerCase())) || headers[0];
        setDetectedColumn(targetCol);

        // Parse preview rows
        const dataRows = lines.slice(1, 6).map(row => {
          const cols = row.split(',');
          return cols[0] ? cols[0].replace(/^["']|["']$/g, '').trim() : row;
        });

        setPreviewRows(dataRows);
        setRowCount(lines.length - 1);
      } catch (err) {
        console.error('Error parsing CSV preview:', err);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = 'feedback\n"The food quality in the canteen was excellent today!"\n"The service at the library desk was extremely slow and unhelpful."\n"The classroom temperature was okay, but the seats are decent."\n"Staff members were super friendly and helped me resolve my fee registration quickly."\n"Hostel rooms are dirty, overcrowded, and the plumbing is broken!"';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_feedback.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUploadCSV(selectedFile);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewRows([]);
    setRowCount(0);
    setErrorMsg(null);
    setDetectedColumn(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Studio Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bulk CSV Upload Studio</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload large feedback datasets (.csv) for automated batch AI sentiment classification
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadSample}
          type="button"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Drag and drop your CSV file here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            or <span className="text-blue-600 dark:text-blue-400 font-bold underline">browse files</span> from your computer
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6">
            Supported file format: .csv (containing a text column named "feedback")
          </p>
        </div>
      ) : (
        /* Selected File Card & Preview */
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedFile.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB • <span className="font-bold text-slate-700 dark:text-slate-300">{rowCount}</span> feedback rows detected
                </p>
              </div>
            </div>
            
            <button
              onClick={clearSelection}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Column Detection Status */}
          {detectedColumn && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Target text column detected: <span className="font-bold">"{detectedColumn}"</span></span>
            </div>
          )}

          {/* Client Preview Table */}
          {previewRows.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">File Preview (First {previewRows.length} entries):</span>
              <ul className="mt-3 space-y-2 text-slate-800 dark:text-slate-200 font-mono">
                {previewRows.map((row, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 truncate">
                    <span className="text-slate-400 font-bold mr-2">{idx + 1}.</span> {row}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Submission */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2.5 disabled:opacity-50"
            >
              <Cpu className="w-5 h-5" />
              <span>{loading ? 'Analyzing CSV with AI Engine...' : 'Analyze CSV with AI'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Error / Warning Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
}

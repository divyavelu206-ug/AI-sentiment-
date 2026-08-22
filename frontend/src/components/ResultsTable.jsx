import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Table as TableIcon, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function ResultsTable({ results, activeSearch, setActiveSearch }) {
  const [filterSentiment, setFilterSentiment] = useState('All');
  const [sortBy, setSortBy] = useState('id'); // 'id', 'confidence-desc', 'confidence-asc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering & Sorting
  const filteredResults = useMemo(() => {
    if (!results) return [];

    return results
      .filter((item) => {
        // Sentiment filter
        if (filterSentiment !== 'All' && item.sentiment !== filterSentiment) {
          return false;
        }
        // Search filter
        if (activeSearch) {
          return item.text.toLowerCase().includes(activeSearch.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'confidence-desc') return b.confidence - a.confidence;
        if (sortBy === 'confidence-asc') return a.confidence - b.confidence;
        if (sortBy === 'sentiment') return a.sentiment.localeCompare(b.sentiment);
        return a.id - b.id;
      });
  }, [results, filterSentiment, activeSearch, sortBy]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getBadgeStyle = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Negative':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />;
      case 'Negative':
        return <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600 dark:text-rose-400" />;
      default:
        return <MinusCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Table Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <TableIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analyzed Feedback Results</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredResults.length} of {results.length} total entries
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={activeSearch}
              onChange={(e) => {
                setActiveSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search feedback text..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activeSearch && (
              <button
                onClick={() => setActiveSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            {['All', 'Positive', 'Negative', 'Neutral'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilterSentiment(tab);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  filterSentiment === tab
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">Sort: Default Order</option>
              <option value="confidence-desc">Sort: Confidence (High → Low)</option>
              <option value="confidence-asc">Sort: Confidence (Low → High)</option>
              <option value="sentiment">Sort: Sentiment</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table View */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Feedback Entry</th>
              <th className="py-3 px-4 w-36">Sentiment</th>
              <th className="py-3 px-4 w-32 text-right">Confidence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedResults.length > 0 ? (
              paginatedResults.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">{item.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    {item.text}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(item.sentiment)}`}>
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full ${
                            item.confidence >= 80 ? 'bg-emerald-500' : item.confidence >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span>{item.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                  No feedback entries found matching your search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

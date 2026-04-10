import { useState, useEffect } from 'react';
import axios from 'axios';


const CLASS_COLOR = {
  'Non Demented':       '#059669',
  'Very Mild Dementia': '#D97706',
  'Mild Dementia':      '#EA580C',
  'Moderate Dementia':  '#DC2626',
};

function cellStyle(value, maxValue, isCorrect) {
  const ratio = maxValue > 0 ? value / maxValue : 0;
  if (isCorrect) {
    // Diagonal → blue scale
    const alpha = 0.15 + ratio * 0.7;
    return {
      background:   `rgba(29, 78, 216, ${alpha})`,
      color:        ratio > 0.45 ? '#fff' : '#1e3a8a',
      borderColor:  '#BFDBFE',
      fontWeight:   '700',
    };
  }
  // Off-diagonal → slate scale
  const alpha = 0.04 + ratio * 0.25;
  return {
    background:  `rgba(100, 116, 139, ${alpha})`,
    color:       ratio > 0.5 ? '#fff' : '#334155',
    borderColor: '#E2E8F0',
    fontWeight:  '500',
  };
}

export default function ConfusionMatrix() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [hovered, setHovered] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    axios.get(`${API_URL}/analytics/confusion-matrix`)
      .then(({ data: d }) => setData(d))
      .catch(() => setError('Could not load the confusion matrix. Please check the backend.'))
      .finally(() => setLoading(false));
  }, [API_URL]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="spinner" />
      <p className="text-slate-500 text-sm">Loading confusion matrix…</p>
    </div>
  );

  if (error) return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-sm font-medium">{error}</p>
    </div>
  );

  if (!data) return null;

  const matrix  = data.confusion_matrix;
  const classes = data.classes ?? ['Mild Dementia', 'Moderate Dementia', 'Non Demented', 'Very Mild Dementia'];
  const maxVal  = Math.max(...matrix.flat());
  const total   = matrix.flat().reduce((a, b) => a + b, 0);
  const correct = matrix.reduce((acc, row, i) => acc + row[i], 0);
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '—';

  const rowTotals     = matrix.map(row => row.reduce((a, b) => a + b, 0));
  const classAcc      = matrix.map((row, i) => rowTotals[i] > 0 ? ((row[i] / rowTotals[i]) * 100).toFixed(1) : '0.0');

  return (
    <div className="space-y-8">

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Overall Accuracy</p>
          <p className="text-3xl font-extrabold text-blue-700">{accuracy}%</p>
          <p className="text-xs text-slate-400 mt-1">Across all four classes</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Correct Predictions</p>
          <p className="text-3xl font-extrabold text-emerald-600">{correct}</p>
          <p className="text-xs text-slate-400 mt-1">Out of {total} samples</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Samples</p>
          <p className="text-3xl font-extrabold text-slate-800">{total}</p>
          <p className="text-xs text-slate-400 mt-1">Validation set size</p>
        </div>
      </div>

      {/* Matrix */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-x-auto">
        <div className="flex items-baseline gap-2 mb-5">
          <h3 className="text-base font-bold text-slate-900">Confusion Matrix</h3>
          <span className="text-xs text-slate-400">Rows = Actual  ·  Columns = Predicted</span>
        </div>

        <div className="inline-block min-w-full">
          {/* Column headers */}
          <div className="flex mb-1 ml-36">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 w-full">Predicted →</p>
          </div>
          <div className="flex gap-1 mb-1">
            <div className="w-36 flex-shrink-0" />
            {classes.map((cls, i) => (
              <div key={i} className="w-20 flex-shrink-0 text-center">
                <p className="text-xs font-semibold text-slate-600 leading-tight" style={{ color: CLASS_COLOR[cls] }}>
                  {cls.split(' ').map((w, wi) => <span key={wi} className="block">{w}</span>)}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {matrix.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 mb-1 items-center">
              {/* Row label */}
              <div className="w-36 flex-shrink-0 text-right pr-3">
                <p className="text-xs font-semibold leading-tight" style={{ color: CLASS_COLOR[classes[rowIdx]] }}>
                  {classes[rowIdx].split(' ').map((w, wi) => <span key={wi} className="block">{w}</span>)}
                </p>
              </div>

              {row.map((value, colIdx) => {
                const isCorrect  = rowIdx === colIdx;
                const style      = cellStyle(value, maxVal, isCorrect);
                const rowTotal   = rowTotals[rowIdx];
                const pct        = rowTotal > 0 ? ((value / rowTotal) * 100).toFixed(0) : '0';
                const isHovered  = hovered?.r === rowIdx && hovered?.c === colIdx;

                return (
                  <div
                    key={colIdx}
                    className="w-20 h-16 flex-shrink-0 flex flex-col items-center justify-center rounded-lg border cursor-default transition-transform"
                    style={{
                      ...style,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isHovered ? '0 4px 12px rgb(0 0 0 / 0.12)' : 'none',
                      zIndex:    isHovered ? 10 : 1,
                    }}
                    onMouseEnter={() => setHovered({ r: rowIdx, c: colIdx })}
                    onMouseLeave={() => setHovered(null)}
                    title={`Actual: ${classes[rowIdx]}\nPredicted: ${classes[colIdx]}\nCount: ${value} (${pct}%)`}
                  >
                    <span className="text-base leading-none" style={{ fontWeight: style.fontWeight, color: style.color }}>
                      {value}
                    </span>
                    <span className="text-xs mt-0.5 opacity-70" style={{ color: style.color }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block opacity-80" />
            Diagonal = correct predictions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" />
            Off-diagonal = misclassifications
          </span>
          <span className="ml-auto">Hover over a cell for details</span>
        </div>
      </div>

      {/* Per-class accuracy bars */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Per-Class Accuracy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {classes.map((cls, i) => (
            <div key={cls} className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{cls}</span>
                <span className="text-sm font-bold" style={{ color: CLASS_COLOR[cls] ?? '#64748B' }}>
                  {classAcc[i]}%
                </span>
              </div>
              <div className="progress-track h-2">
                <div
                  className="progress-fill"
                  style={{ width: `${classAcc[i]}%`, background: CLASS_COLOR[cls] ?? '#94A3B8' }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {matrix[i][i]} / {rowTotals[i]} correct
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How to read */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-sm font-bold text-slate-800 mb-4">How to Read This Matrix</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500">
          {[
            ['Diagonal cells (blue)',     'Correct predictions — the model matched the true stage.'],
            ['Off-diagonal cells (grey)', 'Misclassifications — the true and predicted stages differ.'],
            ['Row direction',             'Each row shows the actual (ground truth) disease stage.'],
            ['Column direction',          'Each column shows what the model predicted.'],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-semibold text-slate-700">{title}</p>
              <p className="mt-0.5 leading-relaxed text-xs">{body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

const CLASS_COLORS = {
  'Non Demented':      { bar: '#059669', bg: '#ECFDF5', text: '#065F46' },
  'Very Mild Dementia':{ bar: '#D97706', bg: '#FFFBEB', text: '#92400E' },
  'Mild Dementia':     { bar: '#EA580C', bg: '#FFF7ED', text: '#7C2D12' },
  'Moderate Dementia': { bar: '#DC2626', bg: '#FEF2F2', text: '#7F1D1D' },
};

const DEFAULT_COLOR = { bar: '#94A3B8', bg: '#F8FAFC', text: '#334155' };

function MetricBar({ value, color }) {
  const pct = (value * 100).toFixed(1);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 progress-track h-2">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-12 text-right">{pct}%</span>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
        <p className="text-3xl font-extrabold" style={{ color }}>{(value * 100).toFixed(1)}%</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: `${color}18` }}>
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  );
}

export default function ModelMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    axios.get(`${API_URL}/analytics/model-metrics`)
      .then(({ data }) => setMetrics(data.metrics))
      .catch(() => setError('Could not load performance metrics. Please check the backend.'))
      .finally(() => setLoading(false));
  }, [API_URL]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="spinner" />
      <p className="text-slate-500 text-sm">Loading performance metrics…</p>
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

  if (!metrics) return null;

  const classes = Object.keys(metrics.precision ?? {});

  return (
    <div className="space-y-8">

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Test Accuracy"       value={metrics.accuracy}            icon="🎯" color="#1D4ED8" />
        <StatCard label="Training Accuracy"   value={metrics.training_accuracy}   icon="📈" color="#7C3AED" />
        <StatCard label="Validation Accuracy" value={metrics.validation_accuracy} icon="✓"  color="#059669" />
      </div>

      {/* Per-class breakdown */}
      {[
        { key: 'precision', label: 'Precision',  icon: '🎯', desc: 'Of all positive predictions, how many were correct'     },
        { key: 'recall',    label: 'Recall',     icon: '📍', desc: 'Of all actual cases, how many did the model find'        },
        { key: 'f1_score',  label: 'F1-Score',   icon: '⚖️', desc: 'Harmonic mean balancing precision and recall'           },
      ].map(({ key, label, icon, desc }) => (
        <section key={key}>
          <div className="flex flex-wrap items-baseline gap-2 mb-4">
            <span className="text-lg">{icon}</span>
            <h3 className="text-base font-bold text-slate-900">{label}</h3>
            <span className="text-xs text-slate-400 ml-auto hidden sm:block">{desc}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map(cls => {
              const c   = CLASS_COLORS[cls] ?? DEFAULT_COLOR;
              const val = metrics[key]?.[cls] ?? 0;
              return (
                <div key={cls} className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:shadow-sm transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{cls}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {(val * 100).toFixed(1)}%
                    </span>
                  </div>
                  <MetricBar value={val} color={c.bar} />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Glossary */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-sm font-bold text-slate-800 mb-4">Understanding These Metrics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['🎯 Precision', 'When the model predicts a stage, how often it is actually that stage.'],
            ['📍 Recall',    'Of all real cases for a stage, how many the model correctly identified.'],
            ['⚖️ F1-Score',  'A balanced score combining precision and recall into one number.'],
            ['✓ Accuracy',   'Overall percentage of correct predictions across all four stages.'],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-slate-700">{title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

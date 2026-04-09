import React from 'react';

// Severity config — maps class names to clinical color coding
const SEVERITY = {
  'Non Demented': {
    label:       'Normal — No Dementia',
    badge:       'badge-normal',
    barColor:    '#059669',
    bgColor:     '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor:   '#065F46',
    icon:        '✓',
    message:     'No significant signs of Alzheimer\'s disease detected in this scan.',
  },
  'Very Mild Dementia': {
    label:       'Very Mild Dementia',
    badge:       'badge-very-mild',
    barColor:    '#D97706',
    bgColor:     '#FFFBEB',
    borderColor: '#FDE68A',
    textColor:   '#92400E',
    icon:        '!',
    message:     'Early signs of cognitive decline detected. Regular monitoring and clinical follow-up is recommended.',
  },
  'Mild Dementia': {
    label:       'Mild Dementia',
    badge:       'badge-mild',
    barColor:    '#EA580C',
    bgColor:     '#FFF7ED',
    borderColor: '#FDBA74',
    textColor:   '#7C2D12',
    icon:        '!!',
    message:     'Moderate cognitive changes observed. A comprehensive neurological evaluation is advised.',
  },
  'Moderate Dementia': {
    label:       'Moderate Dementia',
    badge:       'badge-moderate',
    barColor:    '#DC2626',
    bgColor:     '#FEF2F2',
    borderColor: '#FECACA',
    textColor:   '#7F1D1D',
    icon:        '!!!',
    message:     'Significant cognitive impairment detected. Urgent clinical consultation with a neurologist is strongly recommended.',
  },
};

const DEFAULT_SEVERITY = {
  label: 'Unknown', badge: 'bg-slate-100 text-slate-600 border-slate-200',
  barColor: '#94A3B8', bgColor: '#F8FAFC', borderColor: '#E2E8F0',
  textColor: '#334155', icon: '?', message: '',
};

export default function PredictionResult({ prediction, image }) {
  if (!prediction) return null;

  const { predicted_class, confidence_percentage, all_predictions } = prediction;
  const sev = SEVERITY[predicted_class] ?? DEFAULT_SEVERITY;

  return (
    <div className="space-y-5 animate-slide-up">

      {/* Uploaded scan thumbnail */}
      {image && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Uploaded Scan</p>
          <img
            src={image}
            alt="Uploaded MRI"
            className="w-full rounded-xl object-contain max-h-52 border border-slate-200 bg-slate-50"
          />
        </div>
      )}

      {/* Primary result card */}
      <div
        className="rounded-xl border-l-4 p-5"
        style={{ background: sev.bgColor, borderColor: sev.barColor }}
      >
        <div className="flex items-start gap-4">
          {/* Severity icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: sev.barColor, color: '#fff' }}
          >
            {sev.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Predicted Stage</p>
            <p className="text-xl font-bold leading-tight" style={{ color: sev.textColor }}>{predicted_class}</p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: sev.textColor, opacity: 0.85 }}>
              {sev.message}
            </p>
          </div>
          {/* Confidence badge */}
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-extrabold" style={{ color: sev.barColor }}>
              {confidence_percentage}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">confidence</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="progress-track h-2">
            <div
              className="progress-fill"
              style={{ width: `${confidence_percentage}%`, background: sev.barColor }}
            />
          </div>
        </div>
      </div>

      {/* All class probabilities */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Full Classification Breakdown
        </p>
        <div className="space-y-2.5">
          {Object.entries(all_predictions).map(([cls, score]) => {
            const pct       = (score * 100).toFixed(1);
            const isTop     = cls === predicted_class;
            const clsSev    = SEVERITY[cls] ?? DEFAULT_SEVERITY;

            return (
              <div
                key={cls}
                className={`rounded-xl px-4 py-3 border transition-all ${
                  isTop ? 'border-slate-300 shadow-sm' : 'border-slate-100'
                }`}
                style={{ background: isTop ? '#F8FAFC' : '#FAFAFA' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{cls}</span>
                    {isTop && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ background: clsSev.barColor }}>
                        Top
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{pct}%</span>
                </div>
                <div className="progress-track h-1.5">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: clsSev.barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Clinical Notice —</strong> This result is for screening support only.
          It is not a medical diagnosis. Please consult a licensed neurologist before making any clinical decisions.
        </p>
      </div>

    </div>
  );
}

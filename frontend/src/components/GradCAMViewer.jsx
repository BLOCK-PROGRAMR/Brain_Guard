import React, { useState, useRef } from 'react';
import axios from 'axios';

const SEVERITY_COLOR = {
  'Non Demented':     '#059669',
  'Very Mild Dementia': '#D97706',
  'Mild Dementia':    '#EA580C',
  'Moderate Dementia':'#DC2626',
};

export default function GradCAMViewer({ onComplete, gradcamData, image, onLoading }) {
  const [loading,      setLoading]      = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [localData,    setLocalData]    = useState(gradcamData);
  const [error,        setError]        = useState(null);
  const inputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    onLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await axios.post(`${API_URL}/predict/gradcam`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        onComplete(data, reader.result);
        setLocalData(data);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate Grad-CAM. Try again.');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setLocalData(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const resultData = localData ?? gradcamData;
  const predClass  = resultData?.prediction?.predicted_class;
  const predConf   = resultData?.prediction?.confidence_percentage;
  const sevColor   = predClass ? (SEVERITY_COLOR[predClass] ?? '#64748B') : '#64748B';

  // ── If no result yet → show upload UI ───────────────────────────────────
  if (!resultData) {
    return (
      <div className="space-y-5">
        {/* Explainer */}
        <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-sm text-blue-800">
            <strong>What is Grad-CAM?</strong> Gradient-weighted Class Activation Mapping highlights the specific
            brain regions that most influenced the model's prediction — making the AI decision human-readable.
          </p>
        </div>

        {/* Upload zone */}
        {!preview ? (
          <div
            className="upload-zone flex flex-col items-center justify-center text-center py-14 px-6 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <svg className="w-10 h-10 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm font-semibold text-slate-700">Upload MRI for Grad-CAM analysis</p>
            <p className="text-xs text-slate-400 mt-1">Click to browse · JPG, PNG, BMP</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Selected Scan</p>
              <img src={preview} alt="Preview" className="w-full h-44 object-contain rounded-xl border border-slate-200 bg-slate-50" />
              <p className="text-xs text-slate-400 mt-1 truncate">{selectedFile?.name}</p>
            </div>
            <div className="flex flex-col gap-3 pt-6 sm:pt-7">
              <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Generating…</>
                  : <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                      </svg>
                      Generate Heatmap
                    </>
                }
              </button>
              <button onClick={clearAll} className="btn-secondary w-full">Change Image</button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  }

  // ── Result view ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-slide-up">

      {/* Prediction summary bar */}
      {predClass && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 rounded-xl border"
          style={{ background: `${sevColor}12`, borderColor: `${sevColor}40` }}
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prediction</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: sevColor }}>{predClass}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confidence</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: sevColor }}>{predConf}%</p>
          </div>
        </div>
      )}

      {/* Three-panel image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Original MRI',       src: resultData.original_image,  sub: 'Grayscale brain scan'           },
          { label: 'Attention Heatmap',  src: resultData.gradcam_heatmap, sub: 'Regions of influence'           },
          { label: 'Clinical Overlay',   src: resultData.gradcam_overlay, sub: 'Heatmap blended with scan'      },
        ].map(({ label, src, sub }) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              {src
                ? <img src={src} alt={label} className="w-full h-48 object-contain" />
                : <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No image</div>
              }
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Colour scale legend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold text-slate-700 mb-3">Heatmap Colour Guide</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full" style={{
            background: 'linear-gradient(to right, #1e3a8a, #3b82f6, #fbbf24, #ef4444)',
          }} />
          <div className="flex justify-between text-xs text-slate-500 w-full max-w-[180px]">
            <span>Low influence</span>
            <span>High influence</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {resultData.explanation || 'Yellow and red areas show brain regions that most influenced the model\'s decision.'}
        </p>
      </div>

      {/* Reset button */}
      <div className="flex justify-end">
        <button onClick={clearAll} className="btn-secondary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Analyse Another Scan
        </button>
      </div>

    </div>
  );
}

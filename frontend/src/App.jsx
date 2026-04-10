import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import PredictionResult from './components/PredictionResult';
import GradCAMViewer from './components/GradCAMViewer';
import ConfusionMatrix from './components/ConfusionMatrix';
import ModelMetrics from './components/ModelMetrics';
import './App.css';

// ── Icon helpers ────────────────────────────────────────────────────────────
const Icon = {
  Brain: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.75 3A6.75 6.75 0 003 9.75c0 2.01.883 3.816 2.288 5.063A4.5 4.5 0 009 19.5h6a4.5 4.5 0 003.712-1.687A6.75 6.75 0 0021 9.75 6.75 6.75 0 0014.25 3" />
    </svg>
  ),
  Stethoscope: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Grid: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// ── Nav tabs config ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'predict',   label: 'Diagnosis',    icon: <Icon.Stethoscope /> },
  { id: 'gradcam',   label: 'AI Analysis',  icon: <Icon.Search />      },
  { id: 'metrics',   label: 'Performance',  icon: <Icon.Chart />       },
  { id: 'confusion', label: 'Validation',   icon: <Icon.Grid />        },
];

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,     setActiveTab]     = useState('predict');
  const [prediction,    setPrediction]    = useState(null);
  const [gradcamData,   setGradcamData]   = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [modelInfo,     setModelInfo]     = useState(null);
  const [isModelReady,  setIsModelReady]  = useState(false);
  const [error,         setError]         = useState(null);
  const [menuOpen,      setMenuOpen]      = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Check backend health on mount
  useEffect(() => {
    const check = async () => {
      try {
        const { data: health } = await axios.get(`${API_URL}/health`);
        if (health.model_loaded) {
          setIsModelReady(true);
          const { data: info } = await axios.get(`${API_URL}/model/info`);
          setModelInfo(info);
        }
      } catch {
        setIsModelReady(false);
        setError('Unable to connect to the backend. Please make sure the server is running.');
      }
    };
    check();
  }, [API_URL]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo + Name */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white flex-shrink-0">
                <Icon.Brain />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 leading-none block">BrainGuard</span>
                <span className="text-xs text-slate-500 leading-none">Clinical Support System</span>
              </div>
            </div>

            {/* Desktop Tabs (center) */}
            <nav className="hidden md:flex items-end h-full gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right side: status + hamburger */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Status pill */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isModelReady
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isModelReady ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`} />
                {isModelReady ? 'System Online' : 'Connecting…'}
              </div>

              {/* Hamburger (mobile only) */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <Icon.X /> : <Icon.Menu />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              {/* Mobile status */}
              <div className={`flex items-center gap-2 px-3 py-2 mt-1 mb-2 rounded-lg text-xs font-semibold ${
                isModelReady ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isModelReady ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`} />
                {isModelReady ? 'System Online' : 'Connecting…'}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── MODEL INFO STRIP ────────────────────────────────────────────────── */}
      {modelInfo && (
        <div className="bg-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap gap-6">
                <span><span className="opacity-70">Model · </span><strong>EfficientNetB0</strong></span>
                <span><span className="opacity-70">Classes · </span><strong>{modelInfo.num_classes}</strong></span>
                <span><span className="opacity-70">Accuracy · </span><strong>84%</strong></span>
                <span><span className="opacity-70">Parameters · </span><strong>{(modelInfo.total_parameters / 1e6).toFixed(1)}M</strong></span>
              </div>
              <span className="text-blue-200 text-xs">For clinical decision support only — not a substitute for medical diagnosis</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Backend error banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-slide-up">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-semibold text-sm">Connection Error</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-float border border-slate-200 text-center max-w-xs w-full mx-4 animate-slide-up">
              <div className="spinner mx-auto mb-5" />
              <p className="font-semibold text-slate-900 text-base">Analysing Brain MRI</p>
              <p className="text-slate-500 text-sm mt-1">Running through EfficientNetB0…</p>
              <div className="mt-5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── DIAGNOSIS TAB ───────────────────────────────────────────────── */}
        {activeTab === 'predict' && (
          <div className="animate-slide-up">
            {/* Page title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Patient Diagnosis</h1>
              <p className="text-slate-500 text-sm mt-1">
                Upload a brain MRI scan and receive an Alzheimer's stage classification with confidence scores.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload panel */}
              <div className="card">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Icon.Stethoscope />
                  </div>
                  <h2 className="font-semibold text-slate-900">Upload MRI Scan</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5">Accepted formats: JPG, PNG, BMP · Max size: 10 MB</p>
                <ImageUpload
                  onPredictionComplete={(result, img) => {
                    setPrediction(result);
                    setUploadedImage(img);
                    setGradcamData(null);
                    setError(null);
                  }}
                  onLoading={setLoading}
                />
              </div>

              {/* Result panel */}
              {prediction ? (
                <div className="card animate-fade-in">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                      <Icon.Chart />
                    </div>
                    <h2 className="font-semibold text-slate-900">Clinical Assessment</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-5">AI-generated classification and confidence breakdown</p>
                  <PredictionResult prediction={prediction} image={uploadedImage} />
                </div>
              ) : (
                <div className="card flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-2">No scan uploaded yet</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Upload a brain MRI on the left and the clinical assessment will appear here.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-left w-full max-w-xs">
                    {[
                      ['Real-time',   'Instant classification'],
                      ['Explainable', 'Grad-CAM heatmaps'],
                      ['4 stages',    'Full severity scale'],
                      ['Secure',      'No data stored'],
                    ].map(([title, sub]) => (
                      <div key={title} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-blue-700 text-xs font-semibold">✓ {title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AI ANALYSIS TAB ─────────────────────────────────────────────── */}
        {activeTab === 'gradcam' && (
          <div className="animate-slide-up">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">AI Visual Analysis</h1>
              <p className="text-slate-500 text-sm mt-1">
                Grad-CAM highlights the exact brain regions that influenced the model's prediction — making the AI decision transparent and interpretable.
              </p>
            </div>
            <div className="card">
              <GradCAMViewer
                onComplete={(result, img) => { setGradcamData(result); setUploadedImage(img); setError(null); }}
                gradcamData={gradcamData}
                image={uploadedImage}
                onLoading={setLoading}
              />
            </div>
          </div>
        )}

        {/* ── PERFORMANCE TAB ─────────────────────────────────────────────── */}
        {activeTab === 'metrics' && (
          <div className="animate-slide-up">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Model Performance</h1>
              <p className="text-slate-500 text-sm mt-1">
                Precision, recall, and F1-score across all four Alzheimer's disease stages.
              </p>
            </div>
            <div className="card">
              <ModelMetrics />
            </div>
          </div>
        )}

        {/* ── VALIDATION TAB ──────────────────────────────────────────────── */}
        {activeTab === 'confusion' && (
          <div className="animate-slide-up">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Model Validation</h1>
              <p className="text-slate-500 text-sm mt-1">
                Confusion matrix showing how the model classifies each disease stage against the ground truth.
              </p>
            </div>
            <div className="card">
              <ConfusionMatrix />
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                  <Icon.Brain />
                </div>
                <span className="font-bold text-slate-900">BrainGuard</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                A clinical decision support system built to assist medical professionals in the early detection of Alzheimer's disease through MRI analysis.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm">Technology</h4>
              <ul className="space-y-1.5 text-slate-500 text-sm">
                <li>EfficientNetB0 — Transfer Learning</li>
                <li>TensorFlow 2.16 + Keras</li>
                <li>FastAPI + React 18</li>
                <li>Grad-CAM Explainability</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm">Medical Notice</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                This tool is intended for <strong>research and educational use only</strong>. It does not replace a licensed physician's clinical evaluation. Always consult a qualified neurologist for diagnosis.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 BrainGuard Clinical Support System. All rights reserved.</p>
            <p>Trained on ~120,000 MRI images · 84% validation accuracy</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

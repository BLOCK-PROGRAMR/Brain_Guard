import { useState, useRef } from 'react';
import axios from 'axios';

const UploadIcon = () => (
  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export default function ImageUpload({ onPredictionComplete, onLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [error,        setError]        = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [dragging,     setDragging]     = useState(false);
  const inputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const processFile = (file) => {
    if (!file) return;
    setError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, GIF, or BMP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds the 10 MB limit. Please use a smaller image.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    onLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.status === 'success') {
        onPredictionComplete(data, preview);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <div>
      {/* Drop zone */}
      {!preview ? (
        <div
          className={`upload-zone flex flex-col items-center justify-center text-center py-12 px-6 ${dragging ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Drag & drop your MRI scan here
          </p>
          <p className="text-xs text-slate-400 mt-1">or click to browse files</p>
          <span className="mt-4 inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
            JPG · PNG · BMP · GIF · max 10 MB
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        /* Preview */
        <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-5 animate-fade-in">
          <img
            src={preview}
            alt="MRI preview"
            className="w-full h-52 object-cover"
          />
          {/* Dark overlay with filename */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3 flex items-end justify-between">
            <p className="text-white text-xs font-medium truncate max-w-[80%]">{selectedFile.name}</p>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              title="Remove"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Action row */}
      <div className="flex gap-3 mt-2">
        {preview && (
          <button onClick={clearFile} className="btn-secondary flex-1">
            Change Image
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="btn-primary flex-1"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.415 2.798H4.213c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3" />
              </svg>
              Run Diagnosis
            </>
          )}
        </button>
      </div>

      {/* Tip */}
      <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
        For best results, use a clear axial or coronal brain MRI slice with good contrast.
      </p>
    </div>
  );
}

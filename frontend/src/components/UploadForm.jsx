import React, { useState, useRef, useEffect } from 'react';
import { uploadAndAnalyze, runDemo } from '../utils/api';

const STEPS = [
  { label: "Extracting document...",          duration: 1800 },
  { label: "Parsing factory data via LLM...", duration: 2200 },
  { label: "Loading SEC benchmarks...",       duration: 800  },
  { label: "Attributing energy per product...",duration: 900 },
  { label: "Attributing materials...",        duration: 700  },
  { label: "Running Monte Carlo (N=1000)...", duration: 1200 },
  { label: "Computing confidence intervals...",duration: 600 },
  { label: "Generating recommendations...",  duration: 500  },
  { label: "Finalising output...",            duration: 400  },
];

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles]             = useState([]);
  const [isDragging, setIsDragging]   = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError]             = useState(null);
  const [stepIdx, setStepIdx]         = useState(0);
  const [gridRegion, setGridRegion]   = useState('india_national');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const fileInputRef = useRef(null);
  const stepTimer    = useRef(null);
  const acceptedTypes = ['application/pdf', 'text/csv', 'text/plain'];

  useEffect(() => {
    if (!isUploading) { setStepIdx(0); return; }
    let idx = 0;
    const advance = () => {
      idx = Math.min(idx + 1, STEPS.length - 1);
      setStepIdx(idx);
      if (idx < STEPS.length - 1)
        stepTimer.current = setTimeout(advance, STEPS[idx].duration);
    };
    stepTimer.current = setTimeout(advance, STEPS[0].duration);
    const handleDemo = async () => {
    setIsDemoLoading(true);
    setError(null);
    try {
      const result = await runDemo();
      onUploadSuccess(result.job_id, result.products || [], result.recommendations || []);
    } catch (err) {
      setError(err.message || 'Demo failed. Is the backend running?');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return () => clearTimeout(stepTimer.current);
  }, [isUploading]);

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files));
  };

  const addFiles = (newFiles) => {
    const valid = newFiles.filter(f =>
      acceptedTypes.includes(f.type) || f.name.endsWith('.pdf') || f.name.endsWith('.csv') || f.name.endsWith('.txt')
    );
    setFiles(prev => [...prev, ...valid]);
    setError(null);
  };

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadAndAnalyze(files, gridRegion);
      onUploadSuccess(result.job_id, result.products || [], result.recommendations || []);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    setError(null);
    try {
      const result = await runDemo();
      onUploadSuccess(result.job_id, result.products || [], result.recommendations || []);
    } catch (err) {
      setError(err.message || 'Demo failed. Is the backend running?');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-10 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
      <div
        className={`relative overflow-hidden border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging ? 'border-orange-500/50 bg-orange-500/10 shadow-[inset_0_0_30px_rgba(249,115,22,0.1)]' : 'border-white/20 hover:border-orange-500/40 hover:bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input type="file" multiple accept=".pdf,.csv,.txt" className="hidden"
          ref={fileInputRef} onChange={(e) => addFiles(Array.from(e.target.files))} />
        <div className="relative z-10 flex flex-col items-center">
          <div className={`p-4 rounded-full mb-5 border transition-colors ${isDragging ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-black/40 text-orange-500 border-white/10'}`}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-serif text-2xl tracking-wide text-white">Initialize Data Upload</p>
          <p className="text-sm mt-3 text-zinc-400 font-light">Drag & drop nodes (PDF, CSV, TXT) or browse</p>
        </div>
      </div>

      {/* Try Demo button */}
      {!isUploading && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDemo}
            disabled={isDemoLoading || isUploading}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-orange-300 transition-colors px-4 py-2 rounded-full border border-white/5 hover:border-orange-500/20 bg-black/20"
          >
            {isDemoLoading ? (
              <>
                <svg className="animate-spin h-3 w-3 text-orange-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Loading demo...
              </>
            ) : (
              <>⚡ Try Demo — Rajkot Forging Unit (Feb 2026)</>
            )}
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Pending Payloads</h3>
          <ul className="space-y-3">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center truncate">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-4 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                  <span className="text-sm font-medium text-zinc-200 truncate">{file.name}</span>
                  <span className="text-xs text-zinc-500 ml-4 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-zinc-500 hover:text-red-400 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && (
        <div className="mt-8 p-5 bg-black/30 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <svg className="animate-spin h-4 w-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="text-sm text-orange-300 font-mono">{STEPS[stepIdx].label}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < stepIdx ? 'bg-orange-500' : i === stepIdx ? 'bg-orange-400 animate-pulse' : 'bg-white/10'
              }`} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-zinc-600">Bayesian disaggregation engine</span>
            <span className="text-xs text-zinc-600">{Math.round((stepIdx / (STEPS.length - 1)) * 100)}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">⚠ {error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading}
        className={`w-full mt-8 py-4 px-6 rounded-full font-medium tracking-wide transition-all duration-300 flex justify-center items-center ${
          files.length === 0 || isUploading
            ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'
            : 'bg-orange-500/10 border border-orange-400/30 backdrop-blur-md text-orange-50 hover:bg-orange-500/30 hover:border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
        }`}
      >
        {isUploading ? 'Analysing...' : 'Execute Disaggregation'}
      </button>
    </div>
  );
};

export default UploadForm;
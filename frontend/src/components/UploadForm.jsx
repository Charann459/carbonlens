import React, { useState, useRef } from 'react';

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const acceptedTypes = ['application/pdf', 'text/csv', 'text/plain'];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      acceptedTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.csv') || file.name.endsWith('.txt')
    );
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove) => setFiles(prev => prev.filter((_, i) => i !== indexToRemove));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess("cbf-node-99x-" + Math.floor(Math.random() * 10000));
    }, 2500);
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
        <input type="file" multiple accept=".pdf,.csv,.txt" className="hidden" ref={fileInputRef} onChange={(e) => addFiles(Array.from(e.target.files))} />
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

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Pending Payloads</h3>
          <ul className="space-y-3">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center truncate">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-4 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                  <span className="text-sm font-medium text-zinc-200 truncate">{file.name}</span>
                  <span className="text-xs text-zinc-500 ml-4 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="text-zinc-500 hover:text-red-400 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading}
        className={`w-full mt-10 py-4 px-6 rounded-full font-medium tracking-wide transition-all duration-300 flex justify-center items-center ${
          files.length === 0 || isUploading 
            ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5' 
            : 'bg-orange-500/10 border border-orange-400/30 backdrop-blur-md text-orange-50 hover:bg-orange-500/30 hover:border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
        }`}
      >
        {isUploading ? 'Processing Telemetry...' : 'Execute Disaggregation'}
      </button>
    </div>
  );
};

export default UploadForm;
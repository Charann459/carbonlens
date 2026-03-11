import React, { useState } from 'react';

const ExportPanel = ({ jobId }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (type) => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`Export triggered for ${type.toUpperCase()}`);
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
        className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center"
      >
        <span className="mr-2 opacity-70">📄</span> Download PDF
      </button>

      <button
        onClick={() => handleExport('cbam')}
        disabled={isExporting}
        className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-orange-500/10 border border-orange-500/30 text-orange-50 hover:bg-orange-500/20 flex items-center"
      >
        <span className="mr-2 opacity-70">📦</span> Export CBAM JSON
      </button>
    </div>
  );
};

export default ExportPanel;
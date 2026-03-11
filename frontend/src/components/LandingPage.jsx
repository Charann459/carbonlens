import React from 'react';

const LandingPage = ({ onLaunchApp }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl animate-fade-in-up">
          <h1 
            className="text-6xl md:text-8xl text-white mb-6 tracking-tight leading-[1.1] font-serif"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
          >
            AI-Powered Carbon <br />
            Footprint Intelligence
          </h1>
          <p className="text-sm md:text-base text-zinc-200/80 max-w-2xl mb-12 leading-relaxed font-light drop-shadow-md">
            Seamlessly extract and disaggregate bulk factory data into definitive, CBAM-compliant emissions reporting. Built specifically for Tier 3 manufacturing supply chains.
          </p>
          <button 
            onClick={onLaunchApp}
            className="px-8 py-3.5 rounded-full text-orange-50 font-medium tracking-wide bg-orange-500/10 border border-orange-400/30 backdrop-blur-md hover:bg-orange-500/30 hover:border-orange-400/60 shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105"
          >
            Upload Your Document
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl px-4 pb-24 text-left">
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-2xl font-serif text-white mb-3">Document Extraction</h3>
          <p className="text-zinc-400/80 text-sm leading-relaxed font-light">
            Upload raw electricity bills and material invoices. Our system automatically extracts critical telemetry without manual data entry.
          </p>
        </div>
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
            <span className="text-2xl">🔬</span>
          </div>
          <h3 className="text-2xl font-serif text-white mb-3">Bayesian Disaggregation</h3>
          <p className="text-zinc-400/80 text-sm leading-relaxed font-light">
            Physics-informed probabilistic models allocate bulk energy and materials to specific product lines using BEE benchmarks.
          </p>
        </div>
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-red-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-2xl font-serif text-white mb-3">CBAM Compliance</h3>
          <p className="text-zinc-400/80 text-sm leading-relaxed font-light">
            Export directly to EU-mandated JSON schemas and generate PDF audits with complete confidence intervals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
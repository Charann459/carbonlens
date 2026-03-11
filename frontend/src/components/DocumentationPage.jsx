import React from 'react';

const DocumentationPage = () => (
  <div className="animate-fade-in-up max-w-5xl mx-auto px-4 py-16">
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-12 shadow-2xl">
      <h2 className="text-5xl font-serif text-white mb-10 tracking-tight drop-shadow-md">Documentation</h2>
      
      <div className="space-y-12 text-zinc-300/80 font-light leading-relaxed">
        <section>
          <h3 className="text-3xl font-serif text-white mb-6 border-b border-white/5 pb-4">1. Disaggregation Algorithm</h3>
          <p className="mb-6">CarbonLens utilizes a physics-informed Bayesian modeling approach to disaggregate factory-level energy and material data into per-product emission estimates.</p>
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm text-orange-200/80 leading-loose">
            <p>E_total = Total factory electricity (kWh)</p>
            <p>M_total = Total bulk material (kg)</p>
            <p className="mt-4 text-zinc-500">// Step 1: Compute weights</p>
            <p>Weight_i = SEC_benchmark_i × Volume_i × UnitWeight_i</p>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default DocumentationPage;
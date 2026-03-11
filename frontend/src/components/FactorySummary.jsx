import React from 'react';

const FactorySummary = ({ products }) => {
  const totalCo2e   = products.reduce((s, p) => s + p.co2e_estimate, 0);
  const totalCo2Min = products.reduce((s, p) => s + p.co2e_min, 0);
  const totalCo2Max = products.reduce((s, p) => s + p.co2e_max, 0);
  const avgConf     = (products.reduce((s, p) => s + p.confidence_pct, 0) / products.length).toFixed(1);
  const hotspot     = products.reduce((a, b) => a.co2e_estimate > b.co2e_estimate ? a : b);
  const avgIntensity = (products.reduce((s, p) => s + (p.intensity_estimate || 0), 0) / products.length).toFixed(3);

  const stat = (label, value, sub, accent = false) => (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-serif ${accent ? 'text-orange-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </div>
  );

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-orange-500/20 p-8 mb-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        <h3 className="text-lg font-serif text-white">Factory Total</h3>
        <span className="text-xs text-zinc-500 font-light">— all products combined</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {stat("Total CO₂e Estimate", `${(totalCo2e / 1000).toFixed(2)} t`, `${totalCo2e.toLocaleString(undefined, {maximumFractionDigits:0})} kg`, true)}
        {stat("Confidence Interval", `${(totalCo2Min/1000).toFixed(2)} – ${(totalCo2Max/1000).toFixed(2)} t`, "P5 to P95 range")}
        {stat("Avg Intensity", `${avgIntensity} tCO₂e/t`, "tCO₂e per tonne of product")}
        {stat("Avg Confidence", `${avgConf}%`, `across ${products.length} product lines`)}
      </div>

      <div className="bg-black/30 rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Highest Emission Node</p>
          <p className="text-white font-serif">{hotspot.description}</p>
          <p className="text-sm text-zinc-400 mt-1">
            {hotspot.co2e_estimate.toLocaleString(undefined, {maximumFractionDigits:0})} kg CO₂e
            &nbsp;·&nbsp; {hotspot.intensity_estimate} tCO₂e/t
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Scope Split (approx)</p>
          <p className="text-sm text-zinc-300">Scope 2 (grid energy) <span className="text-orange-400 font-mono">~60%</span></p>
          <p className="text-sm text-zinc-300">Scope 1 (material) <span className="text-orange-400 font-mono">~40%</span></p>
        </div>
      </div>
    </div>
  );
};

export default FactorySummary;
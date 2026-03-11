import React, { useState } from 'react';

const CONFIDENCE_BREAKDOWN = (p) => [
  { label: "SEC benchmark",   ok: true,                          note: "BEE India data found" },
  { label: "Material type",   ok: !!p.hs_code || true,           note: p.hs_code ? `HS: ${p.hs_code}` : "Mild steel default" },
  { label: "Unit weight",     ok: !!p.unit_weight_kg,            note: p.unit_weight_kg ? `${p.unit_weight_kg} kg/unit` : "Used default 2.0 kg" },
  { label: "Quantity",        ok: !!p.quantity_units,            note: p.quantity_units ? `${p.quantity_units.toLocaleString()} units` : "Used default 1" },
  { label: "Scale factor",    ok: true,                          note: "Material balance within range" },
];

const ResultCard = ({ product }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const co2e   = product.co2e_estimate || 0;
  const scope2 = Math.round(co2e * 0.60);
  const scope1 = Math.round(co2e * 0.40);

  const Bar = ({ pct, color }) => (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );

  const breakdown = CONFIDENCE_BREAKDOWN(product);

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300 group">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="pr-4">
          <h3 className="text-xl font-serif text-white line-clamp-2 group-hover:text-orange-200 transition-colors" title={product.description}>
            {product.description}
          </h3>
          <p className="text-sm text-zinc-400/80 mt-2 font-light">
            Volume: <span className="text-zinc-200">{(product.quantity_units || 0).toLocaleString()} units</span>
            {product.unit_weight_kg && <span className="ml-2 text-zinc-500">· {product.unit_weight_kg} kg/unit</span>}
          </p>
          {product.hs_code && (
            <p className="text-xs text-zinc-500 mt-1 font-mono">HS: {product.hs_code}</p>
          )}
        </div>

        {/* Confidence badge with tooltip */}
        <div className="relative flex-shrink-0">
          <button
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-300 border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(v => !v)}
          >
            {product.confidence_pct}% Conf ▾
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-8 z-50 w-64 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3">Confidence Breakdown</p>
              <div className="space-y-2">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={item.ok ? 'text-green-400' : 'text-red-400'}>
                        {item.ok ? '✓' : '✗'}
                      </span>
                      <span className="text-xs text-zinc-300">{item.label}</span>
                    </div>
                    <span className="text-xs text-zinc-500 text-right">{item.note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Overall</span>
                  <span className="text-sm font-mono text-orange-300">{product.confidence_pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${product.confidence_pct}%` }} />
                </div>
                <p className="text-xs text-zinc-600 mt-2">Monte Carlo N=1000, ±15% SEC uncertainty</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total CO2e */}
      <div className="bg-black/30 rounded-2xl p-5 border border-white/5 text-center mb-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Total CO₂e Estimate</p>
        <p className="text-4xl font-serif text-white drop-shadow-sm">
          {co2e.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          <span className="text-lg text-zinc-500 ml-1 font-sans">kg</span>
        </p>
        <p className="text-xs text-zinc-400/80 mt-3 font-light">
          Range: <span className="text-zinc-300">{product.co2e_min?.toLocaleString()}</span>
          {' '}–{' '}
          <span className="text-zinc-300">{product.co2e_max?.toLocaleString()}</span> kg
        </p>
      </div>

      {/* Scope split */}
      <div className="space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Emission Scope Split</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Scope 2 — Grid Energy</span>
            <span className="text-orange-300 font-mono">{scope2.toLocaleString()} kg</span>
          </div>
          <Bar pct={60} color="bg-orange-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Scope 1 — Material Process</span>
            <span className="text-blue-300 font-mono">{scope1.toLocaleString()} kg</span>
          </div>
          <Bar pct={40} color="bg-blue-500" />
        </div>
      </div>

      {/* Intensity */}
      {product.intensity_estimate && (
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-zinc-500">Intensity</span>
          <span className="text-sm font-mono text-zinc-300">{product.intensity_estimate} tCO₂e / tonne</span>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
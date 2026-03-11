import React, { useState } from 'react';

const EFFORT_COLOR = {
  'Low':    'text-green-400 bg-green-500/10 border-green-500/20',
  'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'High':   'text-red-400 bg-red-500/10 border-red-500/20',
  'None':   'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const TYPE_COLOR = {
  'grid':    'border-l-orange-500',
  'material':'border-l-blue-500',
  'process': 'border-l-yellow-500',
  'audit':   'border-l-purple-500',
};

const RecommendationsPanel = ({ recommendations }) => {
  const [expanded, setExpanded] = useState(null);

  if (!recommendations || recommendations.length === 0) return null;

  const totalSaving = recommendations
    .filter(r => r.type_tag !== 'maintain')
    .reduce((s, r) => s + r.saving_kg_co2e, 0);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-serif text-white">Reduction Pathways</h3>
          <p className="text-zinc-400 text-sm mt-1 font-light">
            Actionable steps to reduce this factory's carbon footprint
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Max Addressable Saving</p>
          <p className="text-2xl font-serif text-orange-400">
            {(totalSaving / 1000).toFixed(2)}
            <span className="text-base text-zinc-400 ml-1 font-sans">tCO₂e / month</span>
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className={`bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5
              border-l-4 ${TYPE_COLOR[rec.type] || 'border-l-zinc-500'}
              hover:bg-zinc-900/60 transition-all duration-200 overflow-hidden`}
          >
            {/* Summary row */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{rec.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{rec.applies_to}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                {/* Saving badge */}
                {rec.type_tag !== 'maintain' ? (
                  <div className="text-right hidden sm:block">
                    <p className="text-green-400 font-mono text-sm font-medium">
                      −{rec.saving_kg_co2e.toLocaleString()} kg
                    </p>
                    <p className="text-xs text-zinc-500">−{rec.saving_pct}% total</p>
                  </div>
                ) : (
                  <div className="text-right hidden sm:block">
                    <p className="text-blue-400 font-mono text-sm font-medium">
                      +{rec.saving_kg_co2e.toLocaleString()} kg
                    </p>
                    <p className="text-xs text-zinc-500">if switched to primary</p>
                  </div>
                )}

                {/* Effort */}
                <span className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-xs border ${EFFORT_COLOR[rec.effort] || ''}`}>
                  {rec.effort} effort
                </span>

                {/* Timeframe */}
                <span className="text-xs text-zinc-500 hidden lg:block w-28 text-right">
                  {rec.timeframe}
                </span>

                {/* Chevron */}
                <span className={`text-zinc-500 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === i && (
              <div className="px-5 pb-5 pt-0 border-t border-white/5">
                <p className="text-zinc-300 text-sm leading-relaxed mt-4">
                  {rec.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs border ${EFFORT_COLOR[rec.effort] || ''}`}>
                    Effort: {rec.effort}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs border border-white/10 text-zinc-400">
                    ⏱ {rec.timeframe}
                  </span>
                  {rec.type_tag !== 'maintain' && (
                    <span className="px-3 py-1 rounded-full text-xs border border-green-500/20 text-green-400 bg-green-500/10">
                      Potential saving: {rec.saving_kg_co2e.toLocaleString()} kg CO₂e/month ({rec.saving_pct}%)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600 mt-4">
        Savings are estimates based on BEE benchmarks and standard EF values.
        Actual results depend on implementation quality and site conditions.
      </p>
    </div>
  );
};

export default RecommendationsPanel;
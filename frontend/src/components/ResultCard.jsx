import React from 'react';

const ResultCard = ({ product }) => {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="pr-4">
          <h3 className="text-xl font-serif text-white line-clamp-2 group-hover:text-orange-200 transition-colors" title={product.description}>
            {product.description}
          </h3>
          <p className="text-sm text-zinc-400/80 mt-2 font-light">
            Volume: <span className="text-zinc-200">{product.quantity_units.toLocaleString()} units</span>
          </p>
        </div>
        <div className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-300 border-orange-500/20">
          {product.confidence_pct}% Conf
        </div>
      </div>

      <div className="bg-black/30 rounded-2xl p-6 border border-white/5 text-center">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Total CO₂e Estimate</p>
        <p className="text-4xl font-serif text-white drop-shadow-sm">
          {product.co2e_estimate.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          <span className="text-lg text-zinc-500 ml-1 font-sans">kg</span>
        </p>
        <p className="text-xs text-zinc-400/80 mt-4 font-light">
          Range: <span className="text-zinc-300">{product.co2e_min}</span> - <span className="text-zinc-300">{product.co2e_max}</span> kg
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
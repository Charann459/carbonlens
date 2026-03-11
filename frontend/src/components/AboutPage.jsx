import React from 'react';

const AboutPage = () => (
  <div className="animate-fade-in-up max-w-4xl mx-auto px-4 py-16">
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-12 md:p-16 shadow-2xl">
      <h2 className="text-5xl font-serif text-white mb-8 tracking-tight drop-shadow-md">The Mission</h2>
      
      <div className="space-y-8 text-zinc-300/80 leading-relaxed font-light text-lg">
        <p>
          Tier 3 manufacturers supply global OEMs but often lack granular, per-product energy sub-metering. With the EU's Carbon Border Adjustment Mechanism (CBAM) entering its definitive phase, this creates a critical compliance gap across the supply chain.
        </p>
        <div className="p-8 bg-black/40 rounded-2xl border border-white/5 border-l-4 border-l-orange-500">
          <h3 className="text-2xl font-serif text-white mb-3">Our Solution</h3>
          <p className="text-base">
            CarbonLens demands only the data that factories already possess: total energy bills and bulk material invoices. We bridge the gap using artificial intelligence and physics.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
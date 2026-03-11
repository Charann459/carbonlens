import React from 'react';

const CommunityPage = () => (
  <div className="animate-fade-in-up max-w-5xl mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-6xl font-serif text-white mb-6 tracking-tight drop-shadow-lg">
        Join the Network
      </h2>
      <p className="text-xl text-zinc-300/80 max-w-2xl mx-auto font-light">
        We are building an open-source, federated ecosystem for transparent manufacturing emissions.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[2rem] border border-white/5 hover:bg-zinc-900/60 transition-all">
        <h3 className="text-3xl font-serif text-white mb-4">Code Contributions</h3>
        <p className="text-zinc-400/80 mb-8 font-light leading-relaxed">
          Help us build v0.2.0. We are actively seeking pull requests for our upcoming Machine Learning SEC Predictor and SAP/ERP integration connectors.
        </p>
        <a href="#" className="inline-flex items-center px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">
          View GitHub Issues →
        </a>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[2rem] border border-white/5 hover:bg-zinc-900/60 transition-all">
        <h3 className="text-3xl font-serif text-white mb-4">Data Alliance</h3>
        <p className="text-zinc-400/80 mb-8 font-light leading-relaxed">
          Contribute anonymized, verified SEC data to improve our global Bayesian priors without compromising your proprietary operational data.
        </p>
        <a href="#" className="inline-flex items-center px-6 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-100 text-sm hover:bg-orange-500/20 transition-colors">
          Join the Alliance →
        </a>
      </div>
    </div>
  </div>
);

export default CommunityPage;
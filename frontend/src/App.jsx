import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import DocumentationPage from './components/DocumentationPage';
import CommunityPage from './components/CommunityPage';
import LicensePage from './components/LicensePage';
import UploadForm from './components/UploadForm';
import ResultCard from './components/ResultCard';
import ConfidenceChart from './components/ConfidenceChart';
import ExportPanel from './components/ExportPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import FactorySummary from './components/FactorySummary';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [jobId, setJobId] = useState(null);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Called by UploadForm when backend returns results
  const handleUploadSuccess = (newJobId, newProducts, newRecs = []) => {
    setJobId(newJobId);
    setProducts(newProducts);
    setRecommendations(newRecs);
    setCurrentView('results');
  };

  const NavLink = ({ name, view }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`text-sm font-medium tracking-wide transition-colors ${currentView === view ? 'text-orange-400 drop-shadow-md' : 'text-zinc-400 hover:text-white'}`}
    >
      {name}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans relative overflow-x-hidden selection:bg-orange-500/30">

      {/* GLOBAL ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex justify-center items-center overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-orange-600 to-red-700 rounded-full blur-[140px] mix-blend-screen opacity-40 translate-x-[-20%] translate-y-[-10%]"></div>
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-blue-700 to-cyan-900 rounded-full blur-[150px] mix-blend-screen opacity-30 translate-x-[30%] translate-y-[20%]"></div>
        <div className="absolute w-[500px] h-[500px] bg-orange-500 rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('landing')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-shadow">
              <span className="text-sm font-bold text-black font-serif">C</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white font-serif">CarbonLens</h1>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 items-center bg-zinc-900/30 px-8 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
            <NavLink name="Home" view="landing" />
            <NavLink name="About" view="about" />
            <NavLink name="Docs" view="docs" />
            <NavLink name="Community" view="community" />
            <NavLink name="License" view="license" />
            <div className="hidden md:block w-px h-4 bg-white/10 mx-2"></div>
            <button
              onClick={() => setCurrentView('app')}
              className="text-sm font-medium text-orange-50 hover:text-white transition-all bg-orange-500/20 px-4 py-1.5 rounded-full border border-orange-500/30 hover:bg-orange-500/40"
            >
              Launch App
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="min-h-[calc(100vh-80px)] pb-12 relative z-10">
        {currentView === 'landing'    && <LandingPage onLaunchApp={() => setCurrentView('app')} />}
        {currentView === 'about'      && <AboutPage />}
        {currentView === 'docs'       && <DocumentationPage />}
        {currentView === 'community'  && <CommunityPage />}
        {currentView === 'license'    && <LicensePage />}

        {currentView === 'app' && (
          <div className="animate-fade-in-up max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-5xl font-serif text-white mb-6 tracking-tight drop-shadow-md">
                System Telemetry Input
              </h2>
              <p className="text-lg text-zinc-300/80 font-light">
                Initialize the Bayesian engine by providing factory documentation.
              </p>
            </div>
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {currentView === 'results' && (
          <div className="animate-fade-in space-y-8 max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-4xl font-serif text-white tracking-tight">Analysis Telemetry</h2>
                <p className="text-zinc-400 mt-3 flex items-center gap-2 font-light">
                  Session Hash:{' '}
                  <span className="font-mono text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                    {jobId}
                  </span>
                </p>
              </div>
              <ExportPanel jobId={jobId} />
            </div>

            {products.length > 0 ? (
              <>
                <FactorySummary products={products} />
                <ConfidenceChart products={products} />
                <div>
                  <h3 className="text-2xl font-serif text-white mb-6">Node Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ResultCard key={product.product_id} product={product} />
                    ))}
                  </div>
                </div>
                <RecommendationsPanel recommendations={recommendations} />
              </>
            ) : (
              <div className="text-center py-20 text-zinc-500">
                <p className="text-lg">No product data returned.</p>
                <p className="text-sm mt-2">The document may not have contained recognisable product lines.</p>
                <button
                  onClick={() => setCurrentView('app')}
                  className="mt-6 px-6 py-2 rounded-full border border-white/10 text-white text-sm hover:bg-white/5 transition"
                >
                  ← Try another document
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
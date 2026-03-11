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

function App() {
  const [currentView, setCurrentView] = useState('landing'); 
  const [jobId, setJobId] = useState(null);

  const mockProducts = [
    { product_id: "P001", description: "Crankshaft blank", hs_code: "720810", quantity_units: 1200, co2e_min: 9100.5, co2e_estimate: 10800.2, co2e_max: 14200.0, confidence_pct: 78, methodology: "physics_informed_bayesian_disaggregation" },
    { product_id: "P002", description: "Suspension arm", hs_code: "870880", quantity_units: 800, co2e_min: 5200.0, co2e_estimate: 6100.5, co2e_max: 7800.0, confidence_pct: 65, methodology: "physics_informed_bayesian_disaggregation" },
    { product_id: "P003", description: "Brake bracket", hs_code: "870840", quantity_units: 2100, co2e_min: 12000.0, co2e_estimate: 15500.0, co2e_max: 22000.0, confidence_pct: 45, methodology: "industry_average_fallback" }
  ];

  const handleUploadSuccess = (newJobId) => {
    setJobId(newJobId);
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
              <span className="text-sm font-bold text-black font-serif">Q</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white font-serif">
              CarbonLens
            </h1>
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
        {currentView === 'landing' && <LandingPage onLaunchApp={() => setCurrentView('app')} />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'docs' && <DocumentationPage />}
        {currentView === 'community' && <CommunityPage />}
        {currentView === 'license' && <LicensePage />}
        
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
                  Session Hash: <span className="font-mono text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">{jobId}</span>
                </p>
              </div>
              <ExportPanel jobId={jobId} />
            </div>
            <ConfidenceChart products={mockProducts} />
            <div>
              <h3 className="text-2xl font-serif text-white mb-6">Node Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <ResultCard key={product.product_id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
import React from 'react';

const LicensePage = () => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto px-4 py-16 relative z-10">
      <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
          <span className="text-orange-500">⚖️</span> MIT License
        </h2>
        
        <div className="bg-black p-8 rounded-xl border border-white/5 font-mono text-sm text-zinc-400 leading-relaxed overflow-x-auto">
          <p className="mb-4">Copyright (c) 2026 CarbonLens Contributors</p>
          <p className="mb-4">
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p className="mb-4">
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p className="text-zinc-500">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicensePage;
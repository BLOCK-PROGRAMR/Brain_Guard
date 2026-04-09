import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-dark border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse-glow">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                BrainGuard AI
              </h1>
              <p className="text-xs text-cyan-300/60 font-medium tracking-wide uppercase">
                Early Alzheimer's Detection
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-teal-900/50 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-sm text-cyan-300 font-medium">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

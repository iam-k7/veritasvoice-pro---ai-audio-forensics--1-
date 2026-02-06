
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-900 bg-[#020617]">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-xl font-bold tracking-tight text-slate-100">
          Veritas<span className="text-sky-500">Voice</span>
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Forensic Engine Badge Removed */}
      </div>
    </header>
  );
};

export default Header;

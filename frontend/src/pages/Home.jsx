import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Activity, ChevronRight, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span>Supervity AI</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-Time Processing Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-400">
          Intelligent Exception <br className="hidden md:block" /> Resolution Workbench
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Empower your financial operations with AI-driven transaction analysis. Automatically detect anomalies, assess risk, and resolve exceptions at lightning speed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            to="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Workbench
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a 
            href="https://supervity.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all duration-300 backdrop-blur-sm"
          >
            Learn More
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Detection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Instantly flag anomalous behavior and uncharacteristic transaction patterns across global endpoints.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Auto-Resolution</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Safely automate the clearing of false positives with high-confidence AI reasoning and configurable thresholds.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Human-in-the-Loop</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Escalate critical risk transactions to human reviewers with rich context, LLM summaries, and clear audit trails.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm relative z-10 border-t border-slate-800/50 mt-12">
        <p>&copy; {new Date().getFullYear()} Supervity AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

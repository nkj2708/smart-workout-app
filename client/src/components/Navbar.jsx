import React from 'react';
import { Dumbbell, Sparkles, LineChart, MessageSquareCode, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, systemStatus }) {
  const navItems = [
    { id: 'generator', label: 'AI Routine Generator', icon: Sparkles },
    { id: 'routine', label: 'Active Workout Plan', icon: Dumbbell },
    { id: 'analytics', label: 'Progress & Analytics', icon: LineChart },
    { id: 'coach', label: 'Gemini AI Coach', icon: MessageSquareCode },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6 text-slate-950 font-extrabold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  FitGenius AI
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  MERN + Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Personalized Fitness & Biometric Intelligence</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">
                {systemStatus?.geminiApiConfigured ? 'Gemini AI Online' : 'AI Engine Ready'}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              {systemStatus?.database?.includes('Connected') ? 'MongoDB Connected' : 'Local Storage Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

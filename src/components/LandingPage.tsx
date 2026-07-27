import React from 'react';
import { Shield, Lock, HardDrive, Play, Zap, FileVideo, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md mb-8">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Private & Secure Video Vault
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Your Personal Video Library.{' '}
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Stored Locally & Strictly Private.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Upload, manage, and stream your private video collection in a high-speed glassmorphism dashboard. Each user gets an isolated encrypted vault with zero tracking.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-xl shadow-blue-600/30 border border-blue-400/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>Create Your Private Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 backdrop-blur-md transition-all shadow-lg"
          >
            Sign In To Existing Vault
          </button>
        </div>

        {/* Video Format Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          <span className="text-xs text-slate-400 mr-2 font-medium">Supported Formats:</span>
          {['MP4', 'MOV', 'MKV', 'WebM'].map((fmt) => (
            <div
              key={fmt}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900/70 text-sky-300 border border-slate-800 shadow-inner flex items-center gap-1.5"
            >
              <FileVideo className="w-3.5 h-3.5 text-sky-400" />
              <span>{fmt}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-slate-700/80 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Isolated User Vaults</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every account operates inside a completely isolated environment. Your videos are strictly accessible only by you using hashed authentication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-slate-700/80 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Local File Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Videos are stored directly in your server's local storage folder. Fast byte-range seeking ensures instant video playback with zero buffering delay.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-slate-700/80 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Smart Auto Thumbnails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated client-side frame extraction generates sharp video thumbnails and exact durations instantly upon upload with zero bandwidth overhead.
            </p>
          </div>
        </div>

        {/* Feature List Checklist */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 max-w-3xl mx-auto flex flex-wrap justify-around gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Search & Instant Filter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>One-Click Favorites</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Rename & Delete Control</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Dark & Light Glass Theme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

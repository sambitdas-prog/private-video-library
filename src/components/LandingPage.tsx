import React from 'react';
import { Shield, Lock, HardDrive, Play, Zap, FileVideo, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="relative overflow-hidden py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-400/30 via-blue-500/20 to-indigo-500/20 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-sky-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 border border-blue-500/30 dark:border-sky-500/30 shadow-lg shadow-blue-500/10 dark:shadow-sky-500/10 backdrop-blur-xl transition-transform hover:scale-105 cursor-pointer" onClick={() => onOpenAuth('signup')}>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Zero Cloud Tracking • 100% Local Encrypted Vault
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Your Private Video Vault.{' '}
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Stored Locally & Strictly Private.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal dark:font-light">
            Upload, organize, and stream your personal video collection with ultra-fast local playback. Secured with isolated user vaults, bcrypt password hashing, and tokenized authorization.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-xl shadow-blue-600/30 dark:shadow-blue-500/20 border border-blue-400/30 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create Your Free Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700/80 backdrop-blur-md transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Sign In To Existing Vault
            </button>
          </div>
        </div>

        {/* Hero Interactive App Window Showcase */}
        <div className="my-12 relative max-w-4xl mx-auto">
          {/* Glass Card Container */}
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:shadow-sky-500/10">
            {/* Window Header */}
            <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
              </div>
              <div className="px-3 py-1 rounded-xl bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shadow-inner">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>vault://localhost:3000/my-encrypted-library</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-500/20">
                <Shield className="w-3 h-3" />
                <span>ACTIVE VAULT</span>
              </div>
            </div>

            {/* Mockup Screen Body */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/60 dark:to-slate-950/90">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Simulated Player Card */}
                <div className="md:col-span-2 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl group cursor-pointer" onClick={() => onOpenAuth('signup')}>
                  <div className="aspect-video relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
                    {/* Simulated Waveform & Play icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-white pl-0.5">
                        <Play className="w-6 h-6 fill-current text-sky-400" />
                      </div>
                    </div>

                    {/* Top Format Badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-sky-300 border border-blue-400/30 backdrop-blur-md">
                      4K MP4 • H.264
                    </div>

                    {/* Bottom Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-950/90 text-slate-200 border border-slate-800 backdrop-blur-md">
                      04:18
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold text-white truncate">Cinematic_4K_Vault_Demo.mp4</span>
                    <span className="text-[11px] text-sky-400 font-mono font-semibold">Ready to Stream</span>
                  </div>
                </div>

                {/* Simulated Feature Quick Highlights */}
                <div className="space-y-3 text-left">
                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Local Disk Engine</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Direct Byte-Range Seeking</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Client Processing</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Auto Thumbnail Extraction</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Isolated Users</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Bcrypt + JWT Encryption</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pill Badges */}
          <div className="hidden sm:flex absolute -top-4 -right-4 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl text-xs font-bold text-slate-800 dark:text-slate-200 items-center gap-2 animate-bounce duration-[3000ms]">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>1GB Max Upload per Video</span>
          </div>
        </div>

        {/* Supported Formats Section */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 my-12">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 uppercase tracking-wider">Supported Formats:</span>
          {['MP4', 'MOV', 'MKV', 'WebM'].map((fmt) => (
            <div
              key={fmt}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/90 dark:bg-slate-900/80 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
            >
              <FileVideo className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>{fmt}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
          <div className="p-7 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:border-blue-400/50 dark:hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Isolated User Vaults</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Every user account operates in a strictly isolated environment. Your video collection and metadata are private and only accessible via secure JWT tokens.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:border-blue-400/50 dark:hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Local File Storage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Videos are stored locally on your machine without third-party cloud servers. HTTP byte-range streaming enables instant scrubbing and smooth playback.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-xl shadow-xl dark:shadow-2xl hover:border-blue-400/50 dark:hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Auto Thumbnails</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Client-side HTML5 canvas frame extraction creates crisp video thumbnails and precise video durations immediately when you upload.
            </p>
          </div>
        </div>

        {/* Feature List Checklist */}
        <div className="mt-12 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 max-w-4xl mx-auto flex flex-wrap justify-around gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Search & Instant Keyword Filter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>One-Click Favorites Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Title Rename & File Management</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Light & Dark Glassmorphism Theme</span>
          </div>
        </div>

      </div>
    </div>
  );
};

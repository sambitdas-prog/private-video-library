import React, { useState } from 'react';
import { Shield, Upload, Search, Star, Moon, Sun, LogOut, User as UserIcon, Film, SlidersHorizontal } from 'lucide-react';
import { User, VideoFilters, SortOption } from '../types';

interface NavbarProps {
  user: User | null;
  filters: VideoFilters;
  onFilterChange: (filters: Partial<VideoFilters>) => void;
  onOpenUpload: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  videoCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  filters,
  onFilterChange,
  onOpenUpload,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  videoCount,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                Private Vault
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider rounded-md bg-blue-500/10 text-sky-400 border border-blue-500/20 uppercase">
                Encrypted
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Personal Video Library</p>
          </div>
        </div>

        {/* Search Bar (Only shown when logged in) */}
        {user && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
              <input
                type="text"
                placeholder="Search your video collection..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => onFilterChange({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Favorites Quick Toggle Button */}
              <button
                onClick={() => onFilterChange({ favoriteOnly: !filters.favoriteOnly })}
                title={filters.favoriteOnly ? 'Show all videos' : 'Filter favorites'}
                className={`p-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                  filters.favoriteOnly
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <Star className={`w-4 h-4 ${filters.favoriteOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline text-xs">Favorites</span>
              </button>

              {/* Upload Button */}
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Video</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onToggleDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:block">
                    {user.username}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800/80">
                      <p className="text-xs font-semibold text-slate-100">{user.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Library Collection</span>
                        <span className="font-semibold text-sky-400">{videoCount} videos</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all mr-1"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 border border-blue-400/30 transition-all hover:scale-[1.02]"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      {user && (
        <div className="px-4 py-2 border-t border-slate-800/60 block md:hidden bg-slate-950/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}
    </header>
  );
};

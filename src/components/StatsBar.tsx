import React from 'react';
import { Film, HardDrive, Star, ArrowUpDown } from 'lucide-react';
import { Video, SortOption } from '../types';
import { formatFileSize } from '../lib/videoUtils';

interface StatsBarProps {
  videos: Video[];
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ videos, currentSort, onSortChange }) => {
  const totalVideos = videos.length;
  const totalStorage = videos.reduce((acc, v) => acc + (v.size || 0), 0);
  const favoritesCount = videos.filter((v) => v.isFavorite).length;

  // Calculate storage percentage based on 10 GB quota default
  const quota = 10 * 1024 * 1024 * 1024;
  const percentage = Math.min(100, Math.round((totalStorage / quota) * 100)) || 1;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 backdrop-blur-xl shadow-md dark:shadow-none flex flex-wrap items-center justify-between gap-4 transition-colors duration-200">
      {/* Metrics */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">My Library</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{totalVideos} Videos</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800/80 pl-4 sm:pl-6">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="min-w-[120px]">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
              <span className="uppercase tracking-wider">Vault Storage</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatFileSize(totalStorage)}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800/80 pl-4 sm:pl-6">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Star className="w-4 h-4 fill-amber-400/30 text-amber-500" />
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Starred</span>
            <span className="font-bold text-amber-600 dark:text-amber-300 text-sm">{favoritesCount} Favorites</span>
          </div>
        </div>
      </div>

      {/* Sort Option Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Sort:</span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-sm"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="duration-desc">Longest Duration</option>
          <option value="size-desc">Largest Size</option>
        </select>
      </div>
    </div>
  );
};

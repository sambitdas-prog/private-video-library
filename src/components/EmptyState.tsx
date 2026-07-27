import React from 'react';
import { Film, Upload, SearchX, Star } from 'lucide-react';

interface EmptyStateProps {
  hasSearchFilter: boolean;
  isFavoriteFilter: boolean;
  onOpenUpload: () => void;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchFilter,
  isFavoriteFilter,
  onOpenUpload,
  onClearFilters,
}) => {
  return (
    <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl max-w-xl mx-auto my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-sky-400 flex items-center justify-center shadow-inner">
        {hasSearchFilter ? (
          <SearchX className="w-8 h-8" />
        ) : isFavoriteFilter ? (
          <Star className="w-8 h-8 text-amber-400" />
        ) : (
          <Film className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">
        {hasSearchFilter
          ? 'No matching videos found'
          : isFavoriteFilter
          ? 'No favorite videos yet'
          : 'Your video vault is empty'}
      </h3>

      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
        {hasSearchFilter
          ? 'Try searching with a different title keyword or clear the search query.'
          : isFavoriteFilter
          ? 'Click the star icon on any video in your collection to add it to your favorites.'
          : 'Upload your first local MP4, MOV, MKV, or WebM video to get started with your private library.'}
      </p>

      {hasSearchFilter || isFavoriteFilter ? (
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Clear Filters
        </button>
      ) : (
        <button
          onClick={onOpenUpload}
          className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all inline-flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video Now</span>
        </button>
      )}
    </div>
  );
};

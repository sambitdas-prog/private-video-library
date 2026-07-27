import React, { useState } from 'react';
import { Play, Star, MoreVertical, Edit2, Trash2, Download, Film, Clock, Calendar, HardDrive } from 'lucide-react';
import { Video } from '../types';
import { formatDuration, formatFileSize, formatDate, getFormatBadgeColor } from '../lib/videoUtils';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onToggleFavorite: (video: Video) => void;
  onRename: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onToggleFavorite,
  onRename,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatInfo = getFormatBadgeColor(video.filename, video.mimeType);

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/90 shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
      {/* Thumbnail Container */}
      <div
        onClick={() => onPlay(video)}
        className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group/thumb"
      >
        {video.thumbnail && !imgError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-4 text-center">
            <Film className="w-10 h-10 text-slate-700 group-hover/thumb:text-sky-400 group-hover/thumb:scale-110 transition-all duration-300" />
            <span className="text-[11px] text-slate-600 mt-2 truncate max-w-[80%] font-mono">
              {video.filename}
            </span>
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/40 group-hover/thumb:bg-slate-950/20 backdrop-blur-[2px] group-hover/thumb:backdrop-blur-none transition-all flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-2xl shadow-blue-500/50 group-hover/thumb:scale-110 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-white pl-0.5">
              <Play className="w-5 h-5 fill-current text-sky-400" />
            </div>
          </div>
        </div>

        {/* Format Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border backdrop-blur-md shadow-md ${formatInfo.bg} ${formatInfo.text}`}>
            {formatInfo.label}
          </span>
        </div>

        {/* Duration Badge (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-950/80 text-slate-200 border border-slate-800 backdrop-blur-md shadow-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(video);
          }}
          title={video.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
            video.isFavorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-amber-400 hover:bg-slate-900'
          }`}
        >
          <Star className={`w-4 h-4 ${video.isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              onClick={() => onPlay(video)}
              className="text-sm font-bold text-slate-100 hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
              title={video.title}
            >
              {video.title}
            </h3>

            {/* Menu Trigger */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-1 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onPlay(video);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    Play Video
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRename(video);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                    Rename Title
                  </button>
                  <a
                    href={`/uploads/${video.storedFilename}`}
                    download={video.filename}
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    Download File
                  </a>
                  <div className="my-1 border-t border-slate-800" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(video);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5" title="Upload Date">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(video.uploadDate)}</span>
          </div>
          <div className="flex items-center gap-1.5" title="File Size">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatFileSize(video.size)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Star, Download, Calendar, HardDrive, Clock, FastForward, Film } from 'lucide-react';
import { Video } from '../types';
import { formatDuration, formatFileSize, formatDate, getFormatBadgeColor } from '../lib/videoUtils';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
  onToggleFavorite: (video: Video) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onToggleFavorite,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
  }, [video]);

  if (!video) return null;

  const videoUrl = `/uploads/${video.storedFilename}`;
  const formatInfo = getFormatBadgeColor(video.filename, video.mimeType);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error('Picture-in-picture error:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">{video.title}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span className={`px-2 py-0.2 text-[10px] font-bold rounded border ${formatInfo.bg} ${formatInfo.text}`}>
                  {formatInfo.label}
                </span>
                <span>•</span>
                <span>{formatDate(video.uploadDate)}</span>
              </div>
            </div>
          </div>

          {/* Right Modal Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(video)}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                video.isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-400'
              }`}
              title={video.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${video.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <a
              href={videoUrl}
              download={video.filename}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Download Video File"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[250px] sm:min-h-[420px]">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            controlsList="nodownload"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full max-h-[65vh] object-contain"
          />

          {/* Speed Selector Overlay (Top Right of Player) */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold backdrop-blur-md shadow-xl flex items-center gap-1.5 transition-all"
              >
                <FastForward className="w-3.5 h-3.5 text-sky-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 mt-2 w-28 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        playbackSpeed === s
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {s}x Speed
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Duration</p>
              <p className="font-mono font-bold text-slate-200">{formatDuration(video.duration)}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">File Size</p>
              <p className="font-bold text-slate-200">{formatFileSize(video.size)}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Uploaded On</p>
              <p className="font-bold text-slate-200">{formatDate(video.uploadDate)}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Pip Mode</p>
              <p className="font-bold text-slate-200">Mini Player</p>
            </div>
            <button
              onClick={handlePictureInPicture}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-semibold border border-slate-700"
            >
              Pop Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

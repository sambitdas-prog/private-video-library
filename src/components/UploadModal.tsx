import React, { useState, useRef } from 'react';
import { X, Upload, FileVideo, CheckCircle2, AlertCircle, Film, Clock, HardDrive, Sparkles } from 'lucide-react';
import { uploadVideoApi } from '../lib/api';
import { extractVideoMetadata, formatDuration, formatFileSize, getFormatBadgeColor } from '../lib/videoUtils';
import { Video } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded: (video: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onVideoUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [thumbnail, setThumbnail] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setError('');
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const validExts = ['mp4', 'mov', 'mkv', 'webm'];

    if (!validExts.includes(ext) && !file.type.startsWith('video/')) {
      setError('Unsupported file format. Please upload MP4, MOV, MKV, or WebM files.');
      return;
    }

    if (file.size > 1024 * 1024 * 1024) {
      setError('File size exceeds the 1GB limit.');
      return;
    }

    setSelectedFile(file);
    // Auto populate title without extension
    const defaultTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setTitle(defaultTitle);

    // Extract thumbnail and duration in real time
    setIsExtracting(true);
    try {
      const meta = await extractVideoMetadata(file);
      setDuration(meta.duration);
      setThumbnail(meta.thumbnail);
    } catch (err) {
      console.warn('Metadata extraction issue:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a video file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploaded = await uploadVideoApi(
        selectedFile,
        title.trim() || selectedFile.name,
        duration,
        thumbnail,
        (progress) => setUploadProgress(progress)
      );
      onVideoUploaded(uploaded);
      handleReset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTitle('');
    setDuration(0);
    setThumbnail('');
    setUploadProgress(0);
    setError('');
  };

  const formatInfo = selectedFile ? getFormatBadgeColor(selectedFile.name, selectedFile.type) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Top Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upload Local Video</h2>
              <p className="text-xs text-slate-400">Supported: MP4, MOV, MKV, WebM (up to 1GB)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {!selectedFile ? (
          /* Drag & Drop Area */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-sky-400 bg-sky-500/10 shadow-2xl scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,.mkv,.webm,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shadow-inner group-hover:scale-110 transition-transform">
              <FileVideo className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-100 mb-1">
              Drag & Drop your video file here
            </p>
            <p className="text-xs text-slate-400 mb-4">or click to browse from computer</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-sky-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto thumbnail & duration generator</span>
            </div>
          </div>
        ) : (
          /* Selected File Preview & Title Input Form */
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
              {/* Thumbnail Frame */}
              <div className="w-full sm:w-36 aspect-video rounded-xl bg-slate-900 overflow-hidden relative shrink-0 border border-slate-800 flex items-center justify-center">
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                    <span className="text-[10px] text-slate-400">Extracting...</span>
                  </div>
                ) : thumbnail ? (
                  <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Film className="w-8 h-8 text-slate-700" />
                )}
                {formatInfo && (
                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold rounded border ${formatInfo.bg} ${formatInfo.text}`}>
                    {formatInfo.label}
                  </span>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0 space-y-1 text-xs">
                <p className="font-bold text-slate-200 truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {formatFileSize(selectedFile.size)}
                  </span>
                  {duration > 0 && (
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {formatDuration(duration)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-rose-400 hover:underline pt-1"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Video Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Video Title
              </label>
              <input
                type="text"
                required
                placeholder="Give your video a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Uploading to Local Vault...</span>
                  <span className="text-sky-400 font-mono">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 transition-all duration-200 shadow-lg shadow-sky-500/50"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Start Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

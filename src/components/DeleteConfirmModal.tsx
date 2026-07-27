import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Video } from '../types';

interface DeleteConfirmModalProps {
  video: Video | null;
  onClose: () => void;
  onConfirm: (video: Video) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  video,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!video) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(video);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-1">Delete Video?</h3>
        <p className="text-xs text-slate-400 mb-4 px-2">
          Are you sure you want to permanently delete <strong className="text-slate-200">"{video.title}"</strong>? This action will remove the video file from your local storage and cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-800 hover:bg-slate-800"
          >
            Keep Video
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 flex items-center gap-1.5"
          >
            {isDeleting ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

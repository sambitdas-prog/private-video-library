import React, { useState, useEffect, useCallback } from 'react';
import { User, Video, VideoFilters } from './types';
import { getCurrentUserApi, fetchVideosApi, updateVideoApi, deleteVideoApi, removeStoredToken } from './lib/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { UploadModal } from './components/UploadModal';
import { RenameModal } from './components/RenameModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StatsBar } from './components/StatsBar';
import { EmptyState } from './components/EmptyState';
import { Film, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<VideoFilters>({
    search: '',
    favoriteOnly: false,
    sortBy: 'date-desc',
  });

  // Videos State
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  // Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [renamingVideo, setRenamingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pv_lib_theme');
    return saved ? saved === 'dark' : true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pv_lib_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pv_lib_theme', 'light');
    }
  }, [isDarkMode]);

  // Check Current Authenticated User on Mount
  useEffect(() => {
    async function initAuth() {
      setIsAuthLoading(true);
      const currentUser = await getCurrentUserApi();
      setUser(currentUser);
      setIsAuthLoading(false);
    }
    initAuth();
  }, []);

  // Fetch User Videos
  const loadVideos = useCallback(async () => {
    if (!user) {
      setVideos([]);
      return;
    }
    setIsLoadingVideos(true);
    try {
      const list = await fetchVideosApi(filters.search, filters.favoriteOnly, filters.sortBy);
      setVideos(list);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  }, [user, filters]);

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user, filters, loadVideos]);

  // Auth Handlers
  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.username}!`);
  };

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setVideos([]);
    showToast('Signed out successfully');
  };

  // Filter Updates
  const handleFilterChange = (partial: Partial<VideoFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  // Video Actions
  const handleToggleFavorite = async (targetVideo: Video) => {
    try {
      const updated = await updateVideoApi(targetVideo.id, {
        isFavorite: !targetVideo.isFavorite,
      });

      setVideos((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );

      if (playingVideo && playingVideo.id === updated.id) {
        setPlayingVideo(updated);
      }

      showToast(
        updated.isFavorite
          ? `Added "${updated.title}" to favorites`
          : `Removed "${updated.title}" from favorites`
      );
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleRenameSave = async (targetVideo: Video, newTitle: string) => {
    const updated = await updateVideoApi(targetVideo.id, { title: newTitle });
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    if (playingVideo && playingVideo.id === updated.id) {
      setPlayingVideo(updated);
    }
    showToast(`Renamed video to "${updated.title}"`);
  };

  const handleDeleteConfirm = async (targetVideo: Video) => {
    await deleteVideoApi(targetVideo.id);
    setVideos((prev) => prev.filter((v) => v.id !== targetVideo.id));
    if (playingVideo && playingVideo.id === targetVideo.id) {
      setPlayingVideo(null);
    }
    showToast(`Deleted video "${targetVideo.title}"`);
  };

  const handleVideoUploaded = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
    showToast(`Successfully uploaded "${newVideo.title}"`);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-xl shadow-blue-500/20 animate-pulse flex items-center justify-center">
            <Film className="w-6 h-6 text-slate-950" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Loading Private Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
        : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Navbar */}
      <Navbar
        user={user}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        videoCount={videos.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Landing Page for Unauthenticated Visitors */
          <LandingPage
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setIsAuthOpen(true);
            }}
          />
        ) : (
          /* Dashboard View for Authenticated Users */
          <div>
            {/* Stats & Sort Header Bar */}
            <StatsBar
              videos={videos}
              currentSort={filters.sortBy}
              onSortChange={(sort) => handleFilterChange({ sortBy: sort })}
            />

            {/* Video Cards Grid */}
            {isLoadingVideos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl bg-slate-900/50 border border-slate-800 p-4 space-y-3 animate-pulse">
                    <div className="aspect-video bg-slate-800 rounded-xl" />
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={(v) => setPlayingVideo(v)}
                    onToggleFavorite={handleToggleFavorite}
                    onRename={(v) => setRenamingVideo(v)}
                    onDelete={(v) => setDeletingVideo(v)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Library or No Search Results State */
              <EmptyState
                hasSearchFilter={Boolean(filters.search.trim())}
                isFavoriteFilter={filters.favoriteOnly}
                onOpenUpload={() => setIsUploadOpen(true)}
                onClearFilters={() => handleFilterChange({ search: '', favoriteOnly: false })}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      <VideoPlayerModal
        video={playingVideo}
        onClose={() => setPlayingVideo(null)}
        onToggleFavorite={handleToggleFavorite}
      />

      <RenameModal
        video={renamingVideo}
        onClose={() => setRenamingVideo(null)}
        onSave={handleRenameSave}
      />

      <DeleteConfirmModal
        video={deletingVideo}
        onClose={() => setDeletingVideo(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 text-xs font-medium text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Private Vault System Online & Full Encryption Active</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Supported formats: <strong className="text-slate-300">MP4, MOV, MKV, WEBM</strong></span>
            <span>•</span>
            <span>Local Storage Engine v2.0</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

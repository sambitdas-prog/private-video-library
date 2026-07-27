export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '00:00';
  const totalSecs = Math.round(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

export function getFormatBadgeColor(filename: string, mimeType: string): { bg: string; text: string; label: string } {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  
  if (ext === 'mp4' || mimeType.includes('mp4')) {
    return { bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-400', label: 'MP4' };
  } else if (ext === 'webm' || mimeType.includes('webm')) {
    return { bg: 'bg-indigo-500/20 border-indigo-500/30', text: 'text-indigo-400', label: 'WebM' };
  } else if (ext === 'mov' || mimeType.includes('quicktime')) {
    return { bg: 'bg-sky-500/20 border-sky-500/30', text: 'text-sky-400', label: 'MOV' };
  } else if (ext === 'mkv' || mimeType.includes('matroska')) {
    return { bg: 'bg-purple-500/20 border-purple-500/30', text: 'text-purple-400', label: 'MKV' };
  }
  
  return { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-400', label: ext.toUpperCase() || 'VIDEO' };
}

/**
 * Client-side video metadata & frame thumbnail extractor using HTML5 video and canvas
 */
export function extractVideoMetadata(file: File): Promise<{ duration: number; thumbnail: string }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(fileUrl);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ duration: 0, thumbnail: '' });
    }, 6000); // 6s timeout fallback

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      // Seek to 1 second or 10% of video length
      const seekTime = Math.min(1.0, duration > 2 ? duration * 0.1 : 0.5);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailData = canvas.toDataURL('image/jpeg', 0.85);
          cleanup();
          resolve({ duration: video.duration || 0, thumbnail: thumbnailData });
          return;
        }
      } catch (err) {
        console.warn('Canvas thumbnail extraction failed:', err);
      }
      cleanup();
      resolve({ duration: video.duration || 0, thumbnail: '' });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      resolve({ duration: 0, thumbnail: '' });
    };
  });
}

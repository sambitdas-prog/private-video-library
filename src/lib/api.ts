import { User, Video, SortOption, AuthResponse } from '../types';

const TOKEN_KEY = 'pv_lib_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  setStoredToken(data.token);
  return data;
}

export async function signupApi(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  setStoredToken(data.token);
  return data;
}

export async function getCurrentUserApi(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      removeStoredToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

export async function fetchVideosApi(search?: string, favoriteOnly?: boolean, sortBy?: SortOption): Promise<Video[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (favoriteOnly) params.set('favorite', 'true');
  if (sortBy) params.set('sortBy', sortBy);

  const res = await fetch(`/api/videos?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch videos');
  }
  return data.videos;
}

export async function uploadVideoApi(
  file: File,
  title: string,
  duration: number,
  thumbnail: string,
  onProgress?: (percent: number) => void
): Promise<Video> {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('title', title);
  formData.append('duration', duration.toString());
  formData.append('thumbnail', thumbnail);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos/upload');

    const token = getStoredToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.video);
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.message || 'Upload failed'));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload'));
    };

    xhr.send(formData);
  });
}

export async function updateVideoApi(
  id: string,
  updates: { title?: string; isFavorite?: boolean; thumbnail?: string; duration?: number }
): Promise<Video> {
  const res = await fetch(`/api/videos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update video');
  }
  return data.video;
}

export async function deleteVideoApi(id: string): Promise<void> {
  const res = await fetch(`/api/videos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to delete video');
  }
}

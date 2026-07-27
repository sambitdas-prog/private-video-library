export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  filename: string;
  storedFilename: string;
  mimeType: string;
  size: number;
  duration: number;
  thumbnail: string;
  isFavorite: boolean;
  uploadDate: string;
}

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'duration-desc' | 'size-desc';

export interface VideoFilters {
  search: string;
  favoriteOnly: boolean;
  sortBy: SortOption;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

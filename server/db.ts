import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  filename: string;
  storedFilename: string;
  mimeType: string;
  size: number;
  duration: number; // in seconds
  thumbnail: string; // base64 data URL or thumbnail path
  isFavorite: boolean;
  uploadDate: string; // ISO string
}

interface DBData {
  users: User[];
  videos: Video[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDB(): DBData {
  if (!fs.existsSync(DB_FILE)) {
    const initialData: DBData = { users: [], videos: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, resetting to default', err);
    return { users: [], videos: [] };
  }
}

function writeDB(data: DBData): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json', err);
  }
}

export const db = {
  getUsers(): User[] {
    return readDB().users;
  },
  findUserByEmail(email: string): User | undefined {
    return readDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id: string): User | undefined {
    return readDB().users.find((u) => u.id === id);
  },
  addUser(user: User): User {
    const data = readDB();
    data.users.push(user);
    writeDB(data);
    return user;
  },

  getVideosByUserId(userId: string): Video[] {
    return readDB().videos.filter((v) => v.userId === userId);
  },
  getVideoById(id: string): Video | undefined {
    return readDB().videos.find((v) => v.id === id);
  },
  addVideo(video: Video): Video {
    const data = readDB();
    data.videos.unshift(video); // latest first
    writeDB(data);
    return video;
  },
  updateVideo(id: string, userId: string, updates: Partial<Pick<Video, 'title' | 'isFavorite' | 'thumbnail' | 'duration'>>): Video | null {
    const data = readDB();
    const index = data.videos.findIndex((v) => v.id === id && v.userId === userId);
    if (index === -1) return null;

    data.videos[index] = { ...data.videos[index], ...updates };
    writeDB(data);
    return data.videos[index];
  },
  deleteVideo(id: string, userId: string): Video | null {
    const data = readDB();
    const index = data.videos.findIndex((v) => v.id === id && v.userId === userId);
    if (index === -1) return null;

    const [deletedVideo] = data.videos.splice(index, 1);
    writeDB(data);

    // Also delete physical file from uploads if it exists
    if (deletedVideo && deletedVideo.storedFilename) {
      const filePath = path.join(UPLOADS_DIR, deletedVideo.storedFilename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Failed to remove video file:', e);
        }
      }
    }

    return deletedVideo;
  }
};

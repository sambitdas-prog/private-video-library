import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db, User, Video } from './server/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'private_video_library_secret_key_2026';
const PORT = 3000;

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

// Multer storage setup
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.mp4', '.mov', '.mkv', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/x-matroska',
    'video/quicktime',
    'video/mkv',
    'video/avi',
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid video format. Supported formats: MP4, MOV, MKV, WebM'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 GB max video upload limit
  },
});

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Serve static uploaded videos with byte-range support
  app.use('/uploads', express.static(uploadsDir, {
    acceptRanges: true,
    cacheControl: true,
    maxAge: '1d',
  }));

  // Auth Middleware
  const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; username: string };
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
  };

  // --- Auth Routes ---
  app.post('/api/auth/signup', async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
      }

      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      db.addUser(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const user = db.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const user = db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  });

  // --- Video Routes (All scoped per authenticated user) ---
  app.get('/api/videos', authenticateToken, (req: AuthRequest, res: Response): void => {
    if (!req.user) return;
    const userId = req.user.id;
    let userVideos = db.getVideosByUserId(userId);

    const { search, favorite, sortBy } = req.query;

    // Filter by search query
    if (search && typeof search === 'string' && search.trim()) {
      const query = search.trim().toLowerCase();
      userVideos = userVideos.filter((v) => v.title.toLowerCase().includes(query));
    }

    // Filter by favorite
    if (favorite === 'true') {
      userVideos = userVideos.filter((v) => v.isFavorite);
    }

    // Sort videos
    if (sortBy === 'title-asc') {
      userVideos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration-desc') {
      userVideos.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'size-desc') {
      userVideos.sort((a, b) => b.size - a.size);
    } else if (sortBy === 'date-asc') {
      userVideos.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
    } else {
      // Default: latest upload first
      userVideos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }

    res.json({ videos: userVideos });
  });

  app.post('/api/videos/upload', authenticateToken, (req: AuthRequest, res: Response): void => {
    upload.single('video')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ message: 'File is too large. Maximum size is 1GB.' });
            return;
          }
          res.status(400).json({ message: `Upload error: ${err.message}` });
          return;
        }
        res.status(400).json({ message: err.message || 'File upload failed' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No video file provided' });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const file = req.file;
      const originalTitle = req.body.title || path.basename(file.originalname, path.extname(file.originalname));
      const parsedDuration = parseFloat(req.body.duration) || 0;
      const thumbnailData = req.body.thumbnail || '';

      const newVideo: Video = {
        id: 'vid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        userId: req.user.id,
        title: originalTitle.trim(),
        filename: file.originalname,
        storedFilename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        duration: Math.round(parsedDuration),
        thumbnail: thumbnailData,
        isFavorite: false,
        uploadDate: new Date().toISOString(),
      };

      db.addVideo(newVideo);

      res.status(201).json({
        message: 'Video uploaded successfully',
        video: newVideo,
      });
    });
  });

  app.get('/api/videos/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
    if (!req.user) return;
    const video = db.getVideoById(req.params.id);
    if (!video || video.userId !== req.user.id) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }
    res.json({ video });
  });

  app.patch('/api/videos/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
    if (!req.user) return;
    const { title, isFavorite, thumbnail, duration } = req.body;

    const updates: Partial<Pick<Video, 'title' | 'isFavorite' | 'thumbnail' | 'duration'>> = {};
    if (typeof title === 'string' && title.trim()) updates.title = title.trim();
    if (typeof isFavorite === 'boolean') updates.isFavorite = isFavorite;
    if (typeof thumbnail === 'string') updates.thumbnail = thumbnail;
    if (typeof duration === 'number') updates.duration = duration;

    const updated = db.updateVideo(req.params.id, req.user.id, updates);
    if (!updated) {
      res.status(404).json({ message: 'Video not found or unauthorized' });
      return;
    }

    res.json({ message: 'Video updated successfully', video: updated });
  });

  app.delete('/api/videos/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
    if (!req.user) return;
    const deleted = db.deleteVideo(req.params.id, req.user.id);
    if (!deleted) {
      res.status(404).json({ message: 'Video not found or unauthorized' });
      return;
    }

    res.json({ message: 'Video deleted successfully', videoId: req.params.id });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Private Video Library server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

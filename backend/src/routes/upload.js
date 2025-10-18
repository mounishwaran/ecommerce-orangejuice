import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, Date.now() + '-' + safe);
  },
});

const upload = multer({ storage });

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const relative = `/uploads/${req.file.filename}`;
  const base = `${req.protocol}://${req.get('host')}`;
  const url = `${base}${relative}`;
  res.status(201).json({ url, relative });
});

export default router;

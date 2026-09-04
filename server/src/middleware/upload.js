import multer from 'multer';
import path from 'path';
import { MAX_UPLOAD_SIZE_BYTES } from '../config/upload.js';

// Store uploaded files in memory instead of the local filesystem.
// Vercel Functions do not provide a persistent writable uploads folder.
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions =
    /\.(jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|txt|csv|zip|rar|tar|gz|json|js|jsx|ts|tsx|py|css|html|md)$/i;

  const extname = allowedExtensions.test(path.extname(file.originalname));

  if (extname) {
    return cb(null, true);
  }

  cb(new Error('File format not supported!'));
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter
});
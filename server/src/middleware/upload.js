import multer from 'multer';
import path from 'path';

// Store uploaded files in memory instead of the local filesystem.
// Vercel Functions do not provide a persistent writable uploads folder.
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions =
    /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|txt|zip|rar|tar|json|js|jsx|ts|tsx|css|html|md/;

  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);
  }

  cb(new Error('File format not supported!'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter
});
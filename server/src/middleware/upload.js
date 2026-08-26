import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter (images, docs, code, zip)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|txt|zip|rar|tar|json|js|jsx|ts|tsx|css|html|md/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  cb(new Error('File format not supported!'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter
});

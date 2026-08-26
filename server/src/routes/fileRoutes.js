import express from 'express';
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile
} from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getProjectFiles);
router.post('/project/:projectId', upload.single('file'), uploadProjectFile);
router.delete('/:id', deleteProjectFile);

export default router;

import express from 'express';
import { getProjectMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getProjectMessages);
router.post('/project/:projectId', sendMessage);

export default router;

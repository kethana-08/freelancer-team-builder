import express from 'express';
import { getProjectActivities } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getProjectActivities);

export default router;

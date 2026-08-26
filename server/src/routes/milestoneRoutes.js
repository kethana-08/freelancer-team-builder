import express from 'express';
import {
  getMilestones,
  createMilestone,
  submitDeliverable,
  approveMilestone
} from '../controllers/milestoneController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getMilestones);
router.post('/project/:projectId', authorize('client', 'admin'), createMilestone);
router.post('/:id/submit', authorize('freelancer', 'admin'), submitDeliverable);
router.post('/:id/approve', authorize('client', 'admin'), approveMilestone);

export default router;

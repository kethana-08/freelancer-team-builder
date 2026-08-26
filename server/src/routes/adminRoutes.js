import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  toggleUserStatus,
  getAdminProjects,
  getAdminSkills,
  createAdminSkill,
  deleteAdminSkill
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/projects', getAdminProjects);
router.get('/skills', getAdminSkills);
router.post('/skills', createAdminSkill);
router.delete('/skills/:id', deleteAdminSkill);

export default router;

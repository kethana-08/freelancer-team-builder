import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteTeam,
  removeTeamMember
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('client', 'admin'), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/invite-team', authorize('client', 'admin'), inviteTeam);
router.delete('/:id/members/:memberId', authorize('client', 'admin'), removeTeamMember);

export default router;

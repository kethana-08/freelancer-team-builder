import express from 'express';
import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getProjectTasks);
router.post('/project/:projectId', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addTaskComment);

export default router;

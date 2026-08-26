import express from 'express';
import { runTeamMatch } from '../controllers/matchingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow authenticated users to run matching (or preview)
router.post('/match', protect, runTeamMatch);

export default router;

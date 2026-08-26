import express from 'express';
import { getMyInvitations, respondToInvitation } from '../controllers/invitationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my-invitations', authorize('freelancer', 'admin'), getMyInvitations);
router.post('/:id/respond', authorize('freelancer', 'admin'), respondToInvitation);

export default router;

import express from 'express';
import { getFreelancers, getFreelancerById, updateProfile, uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/freelancers', getFreelancers);
router.get('/freelancers/:id', getFreelancerById);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;

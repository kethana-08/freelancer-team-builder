import express from 'express';
import { register, login, adminLogin, refreshToken, getMe, demoLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const adminLoginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { success: false, message: 'Too many admin login attempts. Please try again later.' }
});

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLoginLimiter, adminLogin);
router.post('/refresh', refreshToken);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;

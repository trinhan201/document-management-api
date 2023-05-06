import { Router } from 'express';
import {
    signInController,
    getCurrentUserController,
    refreshController,
    signOutController,
    forgotPasswordController,
    resetPasswordController,
    verifyController,
} from '../controllers/auth-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Sign in
router.post('/signin', signInController);

// Refresh token route
router.post('/refresh/:userId', refreshController);

// Sign out route
router.post('/signout', verifyToken, signOutController);

// Get current user route
router.get('/current-user', verifyToken, getCurrentUserController);

// Forgot password route
router.post('/forgot-password', forgotPasswordController);

// Reset password route
router.post('/reset-password', resetPasswordController);

// Veify account route
router.get('/verify', verifyController);

export default router;

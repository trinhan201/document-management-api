import { Router } from 'express';
import {
    createUserController,
    updateUserController,
    updateRoleController,
    activateUserController,
    deleteUserController,
    changePasswordController,
    getAllUserController,
    getUserByIdController,
    deleteManyUserController,
} from '../controllers/user-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin, isModerator, isMember } from '../middlewares/role.js';

const router = Router();

// Create user route
router.post('/create', verifyToken, isAdmin, createUserController);

// Update user info route
router.put('/update/:userId', verifyToken, isMember, updateUserController);

// Update role route
router.patch('/update-role/:userId', verifyToken, isAdmin, updateRoleController);

// Activate user route
router.patch('/activate/:userId', verifyToken, isAdmin, activateUserController);

// Delete user permanently route
router.delete('/delete/:userId', verifyToken, isAdmin, deleteUserController);

// Delete many users permanently route
router.post('/delete-many', verifyToken, isAdmin, deleteManyUserController);

// Change password route
router.patch('/change-password', verifyToken, isMember, changePasswordController);

// Get all list users route
router.get('/get-all', verifyToken, isModerator, getAllUserController);

// Get user by ID route
router.get('/get/:userId', verifyToken, isModerator, getUserByIdController);

export default router;

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
    changeAvatarController,
    removeAvatar,
    getPublicInfoController,
    changeReqInfoStatusController,
} from '../controllers/user-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin, isMember } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Create user route
router.post('/create', verifyToken, isAdmin, createUserController);

// Update user info route
router.put('/update/:userId', verifyToken, isAdmin, updateUserController);

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
router.get('/get-all', verifyToken, isAdmin, getAllUserController);

// Get user by ID route
router.get('/get/:userId', verifyToken, isAdmin, getUserByIdController);

// Change avatar route
router.post('/change-avatar', verifyToken, upload.single('myFile'), changeAvatarController);

// Remove avatar route
router.delete('/file/:name', verifyToken, removeAvatar);

// Get some public infomation of all users route
router.get('/public-info', verifyToken, getPublicInfoController);

// Change req change info status route
router.patch('/change-req-info-status/:userId', verifyToken, isMember, changeReqInfoStatusController);

export default router;

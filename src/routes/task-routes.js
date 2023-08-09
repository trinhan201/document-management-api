import { Router } from 'express';
import {
    createTaskController,
    uploadFileController,
    deleteFileUrlController,
    updateTaskController,
    updateTaskProgressController,
    deleteTaskController,
    deleteManyTaskController,
    getAllTaskController,
    getTaskByIdController,
    uploadResourceController,
    changeAssignRoleController,
    deleteSubmitFileUrlController,
    changeSubmitStatusController,
} from '../controllers/task-controllers.js';
import upload from '../utils/uploadFile.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create task route
router.post('/create', verifyToken, isModerator, createTaskController);

// Upload file route
router.post('/upload/:taskId', verifyToken, isModerator, upload.array('myFile', 10), uploadFileController);

// Delete file url route
router.patch('/delete-file-url/:taskId', verifyToken, isModerator, deleteFileUrlController);

// Update task route
router.put('/update/:taskId', verifyToken, isModerator, updateTaskController);

// Update task progress route
router.patch('/update-progress/:taskId', verifyToken, isMember, updateTaskProgressController);

// Delete task route
router.delete('/delete/:taskId', verifyToken, isModerator, deleteTaskController);

// Delete many task route
router.post('/delete-many', verifyToken, isModerator, deleteManyTaskController);

// Get all task route
router.get('/get-all', verifyToken, isMember, getAllTaskController);

// Get task by ID route
router.get('/get/:taskId', verifyToken, isMember, getTaskByIdController);

// Submit resource route
router.post('/submit/:taskId', verifyToken, isMember, upload.array('myFile', 10), uploadResourceController);

// Change role of assignee route
router.patch('/change-assign-role/:taskId', verifyToken, isModerator, changeAssignRoleController);

// Delete submit file url route
router.patch('/delete-submit-file-url/:taskId', verifyToken, isMember, deleteSubmitFileUrlController);

// unSubmit resource route
router.patch('/unsubmit/:taskId', verifyToken, isMember, changeSubmitStatusController);

export default router;

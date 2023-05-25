import { Router } from 'express';
import {
    createTaskController,
    uploadFileController,
    deleteFileUrlController,
    updateTaskController,
    deleteTaskController,
    getAllTaskController,
    getTaskByIdController,
} from '../controllers/task-controllers.js';
import upload from '../utils/uploadFile.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Create task route
router.post('/create', createTaskController);

// Upload file route
router.post('/upload/:taskId', upload.array('myFile', 10), uploadFileController);

// Delete file url route
router.patch('/delete-file-url/:taskId', deleteFileUrlController);

// Update task route
router.put('/update/:taskId', updateTaskController);

// Delete task route
router.delete('/delete/:taskId', deleteTaskController);

// Get all task route
router.get('/get-all', verifyToken, getAllTaskController);

// Get task by ID route
router.get('/get/:taskId', getTaskByIdController);

export default router;

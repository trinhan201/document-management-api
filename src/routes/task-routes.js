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
    submitResourceController,
    changeAssignRoleController,
    deleteSubmitFileUrlController,
    unsubmitResourceController,
    updateDeadLineController,
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

// Update task progress route
router.patch('/update-progress/:taskId', updateTaskProgressController);

// Delete task route
router.delete('/delete/:taskId', deleteTaskController);

// Delete many task route
router.post('/delete-many', deleteManyTaskController);

// Get all task route
router.get('/get-all', verifyToken, getAllTaskController);

// Get task by ID route
router.get('/get/:taskId', getTaskByIdController);

// Submit resource route
router.post('/submit/:taskId', verifyToken, upload.array('myFile', 10), submitResourceController);

// Change role of assignee route
router.patch('/change-assign-role/:taskId', changeAssignRoleController);

// Delete submit file url route
router.patch('/delete-submit-file-url/:taskId', verifyToken, deleteSubmitFileUrlController);

// unSubmit resource route
router.patch('/unsubmit/:taskId', verifyToken, unsubmitResourceController);

// update deadline route
router.patch('/update-deadline/:taskId', verifyToken, updateDeadLineController);

export default router;

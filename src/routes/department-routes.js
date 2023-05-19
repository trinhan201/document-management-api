import { Router } from 'express';
import {
    createDepartmentController,
    updateDepartmentController,
    activateDepartmentController,
    deleteDepartmentController,
    deleteManyDepartmentController,
    getAllDepartmentController,
    getDepartmentByIdController,
} from '../controllers/department-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create department route
router.post('/create', verifyToken, isModerator, createDepartmentController);

// Update department route
router.put('/update/:departmentId', verifyToken, isModerator, updateDepartmentController);

// Activate department route
router.patch('/activate/:departmentId', verifyToken, isModerator, activateDepartmentController);

// Delete department route
router.delete('/delete/:departmentId', verifyToken, isModerator, deleteDepartmentController);

// Delete many departments permanently route
router.post('/delete-many', verifyToken, isModerator, deleteManyDepartmentController);

// Get all list department route
router.get('/get-all', verifyToken, isMember, getAllDepartmentController);

// Get department by ID
router.get('/get/:departmentId', verifyToken, isModerator, getDepartmentByIdController);

export default router;

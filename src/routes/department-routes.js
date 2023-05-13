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
import { isAdmin, isMember } from '../middlewares/role.js';

const router = Router();

// Create department route
router.post('/create', verifyToken, isAdmin, createDepartmentController);

// Update department route
router.put('/update/:departmentId', verifyToken, isAdmin, updateDepartmentController);

// Activate department route
router.patch('/activate/:departmentId', verifyToken, isAdmin, activateDepartmentController);

// Delete department route
router.delete('/delete/:departmentId', verifyToken, isAdmin, deleteDepartmentController);

// Delete many departments permanently route
router.post('/delete-many', verifyToken, isAdmin, deleteManyDepartmentController);

// Get all list department route
router.get('/get-all', verifyToken, isMember, getAllDepartmentController);

// Get department by ID
router.get('/get/:departmentId', verifyToken, isAdmin, getDepartmentByIdController);

export default router;

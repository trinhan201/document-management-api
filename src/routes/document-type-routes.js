import { Router } from 'express';
import {
    createDocumentTypeController,
    updateDocumentTypeController,
    activateDocumentTypeController,
    deleteDocumentTypeController,
    deleteManyDocumentTypeController,
    getAllDocumentTypeController,
    getDocumentTypeByIdController,
} from '../controllers/document-type-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin, isMember } from '../middlewares/role.js';

const router = Router();

// Create document type route
router.post('/create', verifyToken, isAdmin, createDocumentTypeController);

// Update document type route
router.put('/update/:documentTypeId', verifyToken, isAdmin, updateDocumentTypeController);

// Activate document type route
router.patch('/activate/:documentTypeId', verifyToken, isAdmin, activateDocumentTypeController);

// Delete department route
router.delete('/delete/:documentTypeId', verifyToken, isAdmin, deleteDocumentTypeController);

// Delete many departments permanently route
router.post('/delete-many', verifyToken, isAdmin, deleteManyDocumentTypeController);

// Get all list department route
router.get('/get-all', verifyToken, isAdmin, getAllDocumentTypeController);

// Get department by ID
router.get('/get/:documentTypeId', verifyToken, isAdmin, getDocumentTypeByIdController);

export default router;

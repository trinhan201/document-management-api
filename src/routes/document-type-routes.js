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
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create document type route
router.post('/create', verifyToken, isModerator, createDocumentTypeController);

// Update document type route
router.put('/update/:documentTypeId', verifyToken, isModerator, updateDocumentTypeController);

// Activate document type route
router.patch('/activate/:documentTypeId', verifyToken, isModerator, activateDocumentTypeController);

// Delete department route
router.delete('/delete/:documentTypeId', verifyToken, isModerator, deleteDocumentTypeController);

// Delete many departments permanently route
router.post('/delete-many', verifyToken, isModerator, deleteManyDocumentTypeController);

// Get all list department route
router.get('/get-all', verifyToken, isMember, getAllDocumentTypeController);

// Get department by ID
router.get('/get/:documentTypeId', verifyToken, isModerator, getDocumentTypeByIdController);

export default router;

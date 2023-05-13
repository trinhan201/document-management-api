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

const router = Router();

// Create document type route
router.post('/create', createDocumentTypeController);

// Update document type route
router.put('/update/:documentTypeId', updateDocumentTypeController);

// Activate document type route
router.patch('/activate/:documentTypeId', activateDocumentTypeController);

// Delete department route
router.delete('/delete/:documentTypeId', deleteDocumentTypeController);

// Delete many departments permanently route
router.post('/delete-many', deleteManyDocumentTypeController);

// Get all list department route
router.get('/get-all', getAllDocumentTypeController);

// Get department by ID
router.get('/get/:documentTypeId', getDocumentTypeByIdController);

export default router;

import { Router } from 'express';
import {
    createDocumentController,
    uploadFileController,
    updateDocumentController,
    changeDocumentStatusController,
    changeDocumentLocationController,
    deleteDocumentController,
    getAllDocumentController,
    getDocumentByIdController,
} from '../controllers/document-controllers.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Create document route
router.post('/create', createDocumentController);

// Upload file route
router.post('/upload/:documentId', upload.array('myFile', 10), uploadFileController);

// Update doucument route
router.put('/update/:documentId', updateDocumentController);

// Change document status route
router.patch('/change-status/:documentId', changeDocumentStatusController);

// Change document current location route
router.patch('/change-location/:documentId', changeDocumentLocationController);

// Delete permanently document route
router.delete('/delete/:documentId', deleteDocumentController);

// Get all document route
router.get('/get-all', getAllDocumentController);

// Get document by ID route
router.get('/get/:documentId', getDocumentByIdController);

export default router;

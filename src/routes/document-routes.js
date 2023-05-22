import { Router } from 'express';
import {
    createDocumentController,
    uploadFileController,
    deleteFileUrlController,
    updateDocumentController,
    changeDocumentStatusController,
    changeDocumentLocationController,
    deleteDocumentController,
    deleteManyDocumentController,
    getAllDocumentController,
    getDocumentByIdController,
} from '../controllers/document-controllers.js';
import upload from '../utils/uploadFile.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create document route
router.post('/create', verifyToken, isModerator, createDocumentController);

// Upload file route
router.post('/upload/:documentId', verifyToken, isModerator, upload.array('myFile', 10), uploadFileController);

// Delete file url route
router.patch('/delete-file-url/:documentId', verifyToken, isModerator, deleteFileUrlController);

// Update doucument route
router.put('/update/:documentId', verifyToken, isModerator, updateDocumentController);

// Change document status route
router.patch('/change-status/:documentId', verifyToken, isModerator, changeDocumentStatusController);

// Change document current location route
router.patch('/change-location/:documentId', verifyToken, isModerator, changeDocumentLocationController);

// Delete document route
router.delete('/delete/:documentId', verifyToken, isModerator, deleteDocumentController);

// Delete many documents route
router.post('/delete-many', verifyToken, isModerator, deleteManyDocumentController);

// Get all document route
router.get('/get-all', verifyToken, isMember, getAllDocumentController);

// Get document by ID route
router.get('/get/:documentId', verifyToken, isMember, getDocumentByIdController);

export default router;

import { Router } from 'express';
import {
    createDocumentTypeController,
    getAllDocumentTypeController,
} from '../controllers/document-type-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create document type route
router.post('/create', verifyToken, isModerator, createDocumentTypeController);

// Get all list department route
router.get('/get-all', verifyToken, isMember, getAllDocumentTypeController);

export default router;

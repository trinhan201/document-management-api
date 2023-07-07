import { Router } from 'express';
import {
    createReqChangeInfoController,
    getAllReqChangeInfoController,
    changeReqChangeInfoStatusController,
    deleteReqChangeInfoController,
} from '../controllers/req-change-info-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isAdmin } from '../middlewares/role.js';

const router = Router();

// Create req data route
router.post('/create', verifyToken, isMember, createReqChangeInfoController);

// Create req data route
router.get('/get-all', verifyToken, isAdmin, getAllReqChangeInfoController);

// Change req data status route
router.patch('/change-status/:reqDataId', verifyToken, isAdmin, changeReqChangeInfoStatusController);

// Delete req data route
router.delete('/delete/:reqDataId', verifyToken, isAdmin, deleteReqChangeInfoController);

export default router;

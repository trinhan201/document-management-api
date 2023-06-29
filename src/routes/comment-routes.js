import { Router } from 'express';
import {
    createCommentController,
    updateCommentController,
    deleteCommentController,
    getAllCommentController,
    getCommentByIdController,
} from '../controllers/comment-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

router.post('/create', verifyToken, createCommentController);
router.patch('/update/:commentId', verifyToken, updateCommentController);
router.delete('/delete/:commentId', verifyToken, deleteCommentController);
router.get('/get-all', verifyToken, getAllCommentController);
router.get('/get/:commentId', verifyToken, getCommentByIdController);

export default router;

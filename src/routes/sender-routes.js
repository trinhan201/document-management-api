import { Router } from 'express';
import { createSenderController, getAllSenderController } from '../controllers/sender-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isModerator, isMember } from '../middlewares/role.js';

const router = Router();

router.post('/create', verifyToken, isModerator, createSenderController);
router.get('/get-all', verifyToken, isMember, getAllSenderController);

export default router;

import { Router } from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import departmentRoutes from './department-routes.js';
import documentTypeRoutes from './document-type-routes.js';
import documentRoutes from './document-routes.js';
import taskRoutes from './task-routes.js';
import notificationRoutes from './notification-routes.js';
import commentRoutes from './comment-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/department', departmentRoutes);
router.use('/document-type', documentTypeRoutes);
router.use('/document', documentRoutes);
router.use('/task', taskRoutes);
router.use('/notification', notificationRoutes);
router.use('/comment', commentRoutes);

export default router;

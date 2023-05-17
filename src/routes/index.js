import { Router } from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import departmentRoutes from './department-routes.js';
import documentTypeRoutes from './document-type-routes.js';
import documentRoutes from './document-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/department', departmentRoutes);
router.use('/document-type', documentTypeRoutes);
router.use('/document', documentRoutes);

export default router;

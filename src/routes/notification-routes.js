import { Router } from 'express';
import {
    createNotificationController,
    getAllNotificationController,
    changeNotificationStatusController,
    deleteNotificationController,
} from '../controllers/notification-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Create notification route
router.post('/create', verifyToken, createNotificationController);

// Create notification route
router.get('/get-all', verifyToken, getAllNotificationController);

// Change notification status route
router.patch('/change-status/:notificationId', verifyToken, changeNotificationStatusController);

// Delete notification route
router.delete('/delete/:notificationId', verifyToken, deleteNotificationController);

export default router;

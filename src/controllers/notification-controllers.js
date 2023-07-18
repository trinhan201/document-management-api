import Notification from '../models/Notification.js';

// Create notification controller
export const createNotificationController = async (req, res) => {
    try {
        const newNotification = new Notification(req.body);

        await newNotification.save();
        res.status(200).json({ code: 200, message: 'Tạo thông báo thành công', data: newNotification });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all notification controller
export const getAllNotificationController = async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        const final = notifications.filter((item) => item.userId === req.user._id);
        const notRead = final?.filter((item) => item.isRead === false);
        res.status(200).json({ code: 200, data: final, notRead: notRead, all: notifications });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change notification status controller
export const changeNotificationStatusController = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ code: 404, message: 'Not found' });
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ code: 200, message: 'Success' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete notification controller
export const deleteNotificationController = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ code: 404, message: 'Không tìm thấy thông báo' });

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ code: 200, message: 'Đã xóa thành công thông báo' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

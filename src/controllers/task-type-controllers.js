import TaskType from '../models/TaskType.js';
import User from '../models/User.js';

export const createTaskTypeController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const existType = await TaskType.findOne({ taskType: req.body.taskType });
        if (existType) return res.status(403).json({ code: 403, message: 'Loại công việc đã được sử dụng' });
        const newTaskType = new TaskType(req.body);

        await newTaskType.save();
        res.status(200).json({ code: 200, message: 'Thêm loại công việc thành công' });
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const getAllTaskTypeController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskTypes = await TaskType.find({}).sort({ createdAt: -1 });
        res.status(200).json({ code: 200, message: 'Successfully', data: taskTypes });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

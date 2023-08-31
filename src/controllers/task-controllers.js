import Document from '../models/Document.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import schedule from 'node-schedule';
import { sendNotification } from '../../index.js';

const getAssignToIds = (arr) => {
    const final = arr.map((item) => item.value);
    return final;
};

// Create task controller
export const createTaskController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const newTask = new Task(req.body);

        await newTask.save();

        // Check deadline
        const startDate = new Date(newTask?.createdAt);
        const endDate = new Date(newTask?.dueDate);
        const allDateToDo = endDate.getTime() - startDate.getTime();
        const outDateSoon = startDate.getTime() + (allDateToDo / 3) * 2;

        schedule.scheduleJob(outDateSoon, async () => {
            await Task.findOneAndUpdate({ _id: newTask._id }, { status: 'Sắp đến hạn' });
            const notification = `Nhiệm vụ ${newTask.taskName} sắp đến hạn`;
            const linkTask = `${process.env.REACT_APP_BASE_URL}/tasks/detail/${newTask._id}`;
            const newNotiId = await Promise.all(
                newTask.assignTo?.map(async (item) => {
                    const newNotification = new Notification({ notification, userId: item.value, linkTask });
                    await newNotification.save();
                    return { notiId: newNotification?._id, userId: newNotification?.userId };
                }),
            );
            sendNotification(
                newNotiId,
                `Nhiệm vụ ${newTask?.taskName} sắp đến hạn`,
                getAssignToIds(newTask?.assignTo),
                `${process.env.REACT_APP_BASE_URL}/tasks/detail/${newTask._id}`,
            );
        });

        schedule.scheduleJob(endDate, async () => {
            await Task.findOneAndUpdate({ _id: newTask._id }, { status: 'Quá hạn' });
            const notification = `Nhiệm vụ ${newTask.taskName} đã quá hạn`;
            const linkTask = `${process.env.REACT_APP_BASE_URL}/tasks/detail/${newTask._id}`;
            const newNotiId = await Promise.all(
                newTask.assignTo?.map(async (item) => {
                    const newNotification = new Notification({ notification, userId: item.value, linkTask });
                    await newNotification.save();
                    return { notiId: newNotification._id, userId: newNotification.userId };
                }),
            );
            sendNotification(
                newNotiId,
                `Nhiệm vụ ${newTask?.taskName} đã quá hạn`,
                getAssignToIds(newTask?.assignTo),
                `${process.env.REACT_APP_BASE_URL}/tasks/detail/${newTask._id}`,
            );
        });

        res.status(200).json({ code: 200, message: 'Công việc được tạo thành công', data: newTask, newTask: newTask });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Upload file controller
export const uploadFileController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;
        const files = req.files;

        if (!files) return res.status(400).json({ code: 400, message: 'Hãy chọn ít nhất 1 file' });

        const fileUrls = files.map((file) => {
            return process.env.BASE_URL + `/static/${file.filename}`;
        });

        const iterator = fileUrls.values();

        for (const value of iterator) {
            await Task.findOneAndUpdate({ _id: taskId }, { $push: { attachFiles: value } });
        }

        res.status(200).json({ code: 200, message: 'Tải file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete file url controller
export const deleteFileUrlController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const filename = req.body.filename;
        if (!filename) return res.status(404).json({ code: 404, message: 'Không tìm thấy file' });
        const task = await Task.findById(req.params.taskId);
        const attachFiles = task.attachFiles.filter((item) => item !== filename);
        await Task.findByIdAndUpdate(req.params.taskId, { attachFiles: attachFiles });
        res.status(200).json({ code: 200, message: 'Xóa file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update task controller
export const updateTaskController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });

        const taskUpdate = await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                $set: req.body,
            },
            {
                new: true,
            },
        );

        const oldDeadline = new Date(task?.dueDate).getTime();
        const newDeadline = new Date(taskUpdate?.dueDate).getTime();

        if (newDeadline > oldDeadline) {
            await Task.findOneAndUpdate({ _id: taskUpdate._id }, { status: 'Còn hạn' });
            const notification = `Nhiệm vụ ${taskUpdate.taskName} đã được gia hạn`;
            const linkTask = `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`;
            const newNotiId = await Promise.all(
                taskUpdate.assignTo?.map(async (item) => {
                    const newNotification = new Notification({ notification, userId: item.value, linkTask });
                    await newNotification.save();
                    return { notiId: newNotification?._id, userId: newNotification?.userId };
                }),
            );
            sendNotification(
                newNotiId,
                `Nhiệm vụ ${taskUpdate?.taskName} đã được gia hạn`,
                getAssignToIds(taskUpdate?.assignTo),
                `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`,
            );

            // Check deadline
            const startDate = new Date(taskUpdate?.updatedAt);
            const endDate = new Date(taskUpdate?.dueDate);
            const allDateToDo = endDate.getTime() - startDate.getTime();
            const outDateSoon = startDate.getTime() + (allDateToDo / 3) * 2;

            schedule.scheduleJob(outDateSoon, async () => {
                await Task.findOneAndUpdate({ _id: taskUpdate._id }, { status: 'Sắp đến hạn' });
                const notification = `Nhiệm vụ ${taskUpdate.taskName} sắp đến hạn`;
                const linkTask = `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`;
                const newNotiId = await Promise.all(
                    taskUpdate.assignTo?.map(async (item) => {
                        const newNotification = new Notification({ notification, userId: item.value, linkTask });
                        await newNotification.save();
                        return { notiId: newNotification?._id, userId: newNotification?.userId };
                    }),
                );
                sendNotification(
                    newNotiId,
                    `Nhiệm vụ ${taskUpdate?.taskName} sắp đến hạn`,
                    getAssignToIds(taskUpdate?.assignTo),
                    `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`,
                );
            });

            schedule.scheduleJob(endDate, async () => {
                await Task.findOneAndUpdate({ _id: taskUpdate._id }, { status: 'Quá hạn' });
                const notification = `Nhiệm vụ ${taskUpdate.taskName} đã quá hạn`;
                const linkTask = `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`;
                const newNotiId = await Promise.all(
                    taskUpdate.assignTo?.map(async (item) => {
                        const newNotification = new Notification({ notification, userId: item.value, linkTask });
                        await newNotification.save();
                        return { notiId: newNotification._id, userId: newNotification.userId };
                    }),
                );
                sendNotification(
                    newNotiId,
                    `Nhiệm vụ ${taskUpdate?.taskName} đã quá hạn`,
                    getAssignToIds(taskUpdate?.assignTo),
                    `${process.env.REACT_APP_BASE_URL}/tasks/detail/${taskUpdate._id}`,
                );
            });
        }

        res.status(200).json({ code: 200, message: 'Công việc được cặp nhật thành công', data: taskUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update task progress controller
export const updateTaskProgressController = async (req, res) => {
    try {
        const taskProgress = req.body.taskProgress;
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                $set: { progress: taskProgress },
            },
            {
                new: true,
            },
        );

        if (taskProgress === 'Hoàn thành') {
            await Document.findOneAndUpdate(
                { documentName: updatedTask?.refLink },
                {
                    $set: { status: 'Hoàn thành' },
                },
            );
        }

        res.status(200).json({ code: 200, message: 'Thay đổi tiến trình công việc thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Undo task controller
export const undoTaskController = async (req, res) => {
    try {
        const isUndoTask = req.body;
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });

        await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                $set: { isUndo: isUndoTask },
            },
            {
                new: true,
            },
        );

        res.status(200).json({ code: 200, message: 'Thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete task controller
export const deleteTaskController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });

        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ code: 200, message: 'Công việc đã được xóa thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete many task controller
export const deleteManyTaskController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const arrayId = req.body.arrayId;
        await Task.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những công việc được chọn đã bị xóa',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all task controller
export const getAllTaskController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        let { page, limit, taskName, createdAt, dueDate, type, status, level, progress } = req.query;

        if (!page) page = 1;
        if (!limit) limit = 5;
        const skip = (page - 1) * limit;

        const adminFilters = {};
        const memberFilters = {};

        if (taskName) {
            adminFilters.taskName = { $regex: taskName, $options: 'i' };
            memberFilters.taskName = { $regex: taskName, $options: 'i' };
        }

        if (createdAt) {
            adminFilters.createdAt = createdAt;
            memberFilters.createdAt = createdAt;
        }

        if (dueDate) {
            adminFilters.dueDate = dueDate;
            memberFilters.dueDate = dueDate;
        }

        if (type) {
            adminFilters.type = type;
            memberFilters.type = type;
        }

        if (status) {
            adminFilters.status = status;
            memberFilters.status = status;
        }

        if (level) {
            adminFilters.level = level;
            memberFilters.level = level;
        }

        if (progress) {
            adminFilters.progress = progress;
            memberFilters.progress = progress;
        }

        memberFilters.assignTo = { $elemMatch: { value: req.user._id } };

        const tasks = await Task.find(adminFilters).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const allTasks = await Task.find(adminFilters);

        const memberTasks = await Task.find(memberFilters).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const allMemberTasks = await Task.find(memberFilters);

        res.status(200).json({
            code: 200,
            tasks: tasks,
            allTasks: allTasks,
            memberTasks: memberTasks,
            allMemberTasks: allMemberTasks,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get task by ID route
export const getTaskByIdController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });
        res.status(200).json({ code: 200, data: task });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Submit resource controller
export const uploadResourceController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;
        const files = req.files;

        if (!files) return res.status(400).json({ code: 400, message: 'Hãy chọn ít nhất 1 file' });
        const fileUrls = files.map((file) => {
            return process.env.BASE_URL + `/static/${file.filename}`;
        });
        const iterator = fileUrls.values();
        for (const value of iterator) {
            await Task.findOneAndUpdate(
                { _id: taskId, 'resources.userId': req.user._id },
                { $push: { 'resources.$.resources': value } },
            );
        }

        res.status(200).json({ code: 200, message: 'Nộp file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change assignee role controller
export const changeAssignRoleController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;
        const { userId, flag } = req.body;
        await Task.findOneAndUpdate({ _id: taskId, 'assignTo.flag': 'Leader' }, { 'assignTo.$.flag': 'Support' });
        await Task.findOneAndUpdate({ _id: taskId, 'assignTo.value': userId }, { 'assignTo.$.flag': flag });
        res.status(200).json({ code: 200, message: 'Đã phân công leader' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete file url controller
export const deleteSubmitFileUrlController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;
        const filename = req.body.filename;
        if (!filename) return res.status(404).json({ code: 404, message: 'Không tìm thấy file' });

        const task = await Task.findById(taskId);
        const memberResources = task.resources.find((item) => item.userId === req.user._id);
        const resources = memberResources.resources.filter((item) => item !== filename);
        await Task.findOneAndUpdate(
            { _id: taskId, 'resources.userId': req.user._id },
            { 'resources.$.resources': resources },
        );
        res.status(200).json({ code: 200, message: 'Hủy nộp file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// change submit status controller
export const changeSubmitStatusController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;
        const currTask = await Task.findById(taskId);
        const submitFlag = req.body.submitFlag;

        await Task.findOneAndUpdate(
            { _id: taskId, 'resources.userId': req.user._id },
            {
                'resources.$.isSubmit': submitFlag,
                'resources.$.status':
                    submitFlag === true ? (currTask?.status === 'Quá hạn' ? 'Trễ' : 'Đã nộp') : 'Chưa nộp',
            },
        );
        res.status(200).json({ code: 200, message: submitFlag ? 'Nộp file thành công' : 'Hủy nộp file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

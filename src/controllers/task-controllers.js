import Task from '../models/Task.js';

// Create task controller
export const createTaskController = async (req, res) => {
    try {
        const newTask = new Task(req.body);

        await newTask.save();
        res.status(200).json({ code: 200, message: 'Công việc được tạo thành công', data: newTask });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Upload file controller
export const uploadFileController = async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        res.status(200).json({ code: 200, message: 'Công việc được cặp nhật thành công', data: taskUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change document status controller
export const updateTaskProgressController = async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskProgress = req.body.taskProgress;
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });

        await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                $set: { progress: taskProgress },
            },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Thay đổi tiến trình công việc thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete task controller
export const deleteTaskController = async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        let { page, limit, level } = req.query;

        if (!page) page = 1;
        if (!limit) limit = 5;
        const skip = (page - 1) * 5;

        const adminFilters = {};
        const memberFilters = {};

        if (level) {
            adminFilters.level = level;
            memberFilters.level = level;
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
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });
        res.status(200).json({ code: 200, data: task });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Submit resource controller
export const submitResourceController = async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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
        await Task.findOneAndUpdate(
            { _id: taskId, 'resources.userId': req.user._id },
            { 'resources.$.isSubmit': true },
        );
        res.status(200).json({ code: 200, message: 'Nộp file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change assignee role controller
export const changeAssignRoleController = async (req, res) => {
    try {
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
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
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

// unSubmit resource controller
export const unsubmitResourceController = async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user._id);
        // if (currentUser.isActived === false)
        //     return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.params.taskId;

        await Task.findOneAndUpdate(
            { _id: taskId, 'resources.userId': req.user._id },
            { 'resources.$.isSubmit': false },
        );
        res.status(200).json({ code: 200, message: 'Hủy nộp file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

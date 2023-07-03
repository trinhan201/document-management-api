import Department from '../models/Department.js';
import User from '../models/User.js';

// Create department controller
export const createDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const department = await Department.findOne({ departmentName: req.body.departmentName });
        if (department) return res.status(403).json({ code: 403, message: 'Tên phòng ban đã được sử dụng' });
        const newDepartment = new Department(req.body);

        await newDepartment.save();
        res.status(200).json({ code: 200, message: 'Phòng ban đã được tạo thành công', data: newDepartment });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update department controller
export const updateDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const department = await Department.findById(req.params.departmentId);
        if (!department) return res.status(404).json({ code: 404, message: 'Không tìm thấy phòng ban' });

        const departmentUpdate = await Department.findByIdAndUpdate(
            req.params.departmentId,
            {
                $set: req.body,
            },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Phòng ban đã được cập nhật thành công', data: departmentUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Activate department controller
export const activateDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const status = req.body.status;
        await Department.findByIdAndUpdate(req.params.departmentId, { $set: { status: status } });
        if (status === true) {
            res.status(200).json({ code: 200, message: 'Phòng ban đã được kích hoạt' });
        } else {
            res.status(200).json({ code: 200, message: 'Phòng ban đã bị vô hiệu hóa' });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete department controller
export const deleteDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const department = await Department.findById(req.params.departmentId);
        if (!department) return res.status(404).json({ code: 404, message: 'Không tìm thấy phòng ban' });

        await Department.findByIdAndDelete(req.params.departmentId);
        res.status(200).json({ code: 200, message: 'Phòng ban đã được xóa thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete many departments permanently controller
export const deleteManyDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const arrayId = req.body.arrayId;
        await Department.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những phòng ban được chọn đã bị xóa vĩnh viễn',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all list department and pagination controller
export const getAllDepartmentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        let { page, limit, search } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 5;

        const skip = (page - 1) * limit;

        const departments = await Department.find(search ? { departmentName: { $regex: search, $options: 'i' } } : {})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const allDepartments = await Department.find(
            search ? { departmentName: { $regex: search, $options: 'i' } } : {},
        );

        res.status(200).json({
            code: 200,
            message: 'Successfully',
            data: departments,
            allDepartments: allDepartments,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get department by ID controller
export const getDepartmentByIdController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const department = await Department.findById(req.params.departmentId);
        if (!department) return res.status(404).json({ code: 404, message: 'Không tìm thấy phòng ban' });
        res.status(200).json({ code: 200, data: department });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

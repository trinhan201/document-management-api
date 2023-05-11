import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import sendMail from '../utils/email.js';

// Generate verify email token
const generateVerifyEmailToken = (user, randomPass) => {
    return jwt.sign({ id: user._id, password: randomPass }, process.env.VERIFY_EMAIL_SECRET, {
        expiresIn: '100s',
    });
};

// Create user controller
export const createUserController = async (req, res) => {
    try {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isEmailExist = await User.findOne({ email: req.body.email });
        if (!emailRegex.test(req.body.email)) return res.status(401).json({ code: 403, message: 'Email không hợp lệ' });
        if (isEmailExist) return res.status(403).json({ code: 403, message: 'Email đã được sử dụng' });
        const randomPass = randomstring.generate(7);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(randomPass, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        const subject = 'Verify your account';
        const token = generateVerifyEmailToken(newUser, randomPass);
        const html = `<p>Click this <a href="${process.env.CLIENT_URL}/api/v1/auth/verify?token=${token}"> link</a> to verify your account`;
        sendMail(newUser.email, subject, html);
        res.status(200).json({ code: 200, message: 'Tạo tài khoản thành công và email xác thực đã được gửi' });
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(err);
    }
};

// Update user controller
export const updateUserController = async (req, res) => {
    try {
        const updateProps = {
            fullName: req.body.fullName,
            gender: req.body.gender,
            birthDate: req.body.birthDate,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            department: req.body.department,
        };
        if (req.user.role === 'Admin') {
            try {
                const userUpdate = await User.findByIdAndUpdate(req.params.userId, updateProps, {
                    new: true,
                });
                res.status(200).json({ code: 200, message: 'Thông tin người dùng đã được cập nhật', data: userUpdate });
            } catch (error) {
                res.status(400).json({ code: 400, message: 'Unexpected error' });
            }
        } else {
            if (req.params.userId === req.user.id) {
                try {
                    const userUpdate = await User.findByIdAndUpdate(req.params.userId, updateProps, { new: true });
                    res.status(200).json({
                        code: 200,
                        message: 'Thông tin người dùng đã được cập nhật',
                        data: userUpdate,
                    });
                } catch (error) {
                    res.status(400).json({ code: 400, message: 'Unexpected error' });
                }
            } else {
                return res.status(403).json({
                    code: 403,
                    message: 'You can update only your account',
                });
            }
        }
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Update role controller
export const updateRoleController = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { $set: { role: req.body.role } }, { new: true });
        res.status(200).json({ code: 200, message: 'Thay đổi vai trò thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Activate user controller
export const activateUserController = async (req, res) => {
    try {
        const isActived = req.body.isActived;
        await User.findByIdAndUpdate(req.params.userId, { $set: { isActived: isActived } });
        if (isActived === true) {
            res.status(200).json({ code: 200, message: 'Tài khoản người dùng đã được kích hoạt' });
        } else {
            res.status(200).json({ code: 200, message: 'Tài khoản người dùng đã bị vô hiệu hóa' });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Delete user permanently controller
export const deleteUserController = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user.role === 'Admin') {
        res.status(403).json({
            code: 403,
            message: 'Bạn không thể xóa tài khoản quản trị viên',
        });
    } else {
        try {
            await User.findOneAndDelete({ _id: req.params.userId });
            res.status(200).json({
                code: 200,
                message: 'Người dùng đã bị xóa vĩnh viễn',
            });
        } catch (error) {
            res.status(400).json({ code: 400, message: 'Unexpected error' });
        }
    }
};

// Delete many users permanently controller
export const deleteManyUserController = async (req, res) => {
    try {
        const arrayId = req.body.arrayId;
        await User.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những người dùng được chọn đã bị xóa vĩnh viễn',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Change password controller
export const changePasswordController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        // Old password from frontend
        const oldPassword = req.body.oldPassword;
        // New password from frontend
        const salt = bcrypt.genSaltSync(10);
        const newPassword = bcrypt.hashSync(req.body.newPassword, salt);
        // Check old password from frontend is the same of password in db
        const isCorrect = await bcrypt.compare(oldPassword, currentUser.password);
        // Check new password conflict with password in db
        const isConflict = await bcrypt.compare(req.body.newPassword, currentUser.password);

        if (!isCorrect) {
            res.status(400).json({
                code: 400,
                message: 'Mật khẩu cũ không chính xác',
            });
        } else {
            if (!isConflict) {
                await User.findByIdAndUpdate({ _id: req.user._id }, { password: newPassword }, { new: true });
                res.status(200).json({
                    code: 200,
                    message: 'Thay đổi mật khẩu thành công',
                });
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'Đây là mật khẩu hiện tại của bạn',
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Get all list user controller
export const getAllUserController = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 5;
        const skip = (page - 1) * 5;
        let users = await User.find(
            search
                ? {
                      $or: [
                          { fullName: { $regex: search, $options: 'i' } },
                          { email: { $regex: search, $options: 'i' } },
                          { phoneNumber: { $regex: search, $options: 'i' } },
                      ],
                  }
                : {},
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        let allUsers = await User.find(
            search
                ? {
                      $or: [
                          { fullName: { $regex: search, $options: 'i' } },
                          { email: { $regex: search, $options: 'i' } },
                          { phoneNumber: { $regex: search, $options: 'i' } },
                      ],
                  }
                : {},
        );
        users = users.filter((item) => item.role !== 'Admin');
        allUsers = allUsers.filter((item) => item.role !== 'Admin');
        res.status(200).json({ code: 200, data: users, allUsers: allUsers });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Get user by ID controller
export const getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found' });
        }
        res.status(200).json({ code: 200, data: user });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

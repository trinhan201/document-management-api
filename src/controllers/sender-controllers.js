import Sender from '../models/Sender.js';
import User from '../models/User.js';

export const createSenderController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const existSender = await Sender.findOne({ sender: req.body.sender });
        if (existSender) return res.status(403).json({ code: 403, message: 'Nơi ban hành đã được sử dụng' });
        const newSender = new Sender(req.body);

        await newSender.save();
        res.status(200).json({ code: 200, message: 'Thêm nơi ban hành thành công' });
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const getAllSenderController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const senders = await Sender.find({}).sort({ createdAt: -1 });
        res.status(200).json({ code: 200, message: 'Successfully', data: senders });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

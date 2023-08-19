import DocumentType from '../models/DocumentType.js';
import User from '../models/User.js';

// Create document type controller
export const createDocumentTypeController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const documentType = await DocumentType.findOne({ documentTypeName: req.body.documentTypeName });
        if (documentType) return res.status(403).json({ code: 403, message: 'Loại văn bản đã được sử dụng' });
        const newDocumentType = new DocumentType(req.body);

        await newDocumentType.save();
        res.status(200).json({ code: 200, message: 'Thêm loại văn bản thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all list document type and pagination controller
export const getAllDocumentTypeController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const docTypes = await DocumentType.find({}).sort({ createdAt: -1 });
        res.status(200).json({ code: 200, message: 'Successfully', data: docTypes });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

import DocumentType from '../models/DocumentType.js';

// Create document type controller
export const createDocumentTypeController = async (req, res) => {
    try {
        const documentType = await DocumentType.findOne({ documentTypeName: req.body.documentTypeName });
        if (documentType) return res.status(403).json({ code: 403, message: 'Loại văn bản đã được sử dụng' });
        const newDocumentType = new DocumentType(req.body);

        await newDocumentType.save();
        res.status(200).json({ code: 200, message: 'Loại văn bản được tạo thành công', data: newDocumentType });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update document type controller
export const updateDocumentTypeController = async (req, res) => {
    try {
        const documentType = await DocumentType.findById(req.params.documentTypeId);
        if (!documentType) return res.status(404).json({ code: 404, message: 'Không tìm thấy loại văn bản' });

        const documentTypeUpdate = await DocumentType.findByIdAndUpdate(
            req.params.documentTypeId,
            {
                $set: req.body,
            },
            {
                new: true,
            },
        );
        res.status(200).json({
            code: 200,
            message: 'Loại văn bản đã được cập nhật thành công',
            data: documentTypeUpdate,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Activate document type controller
export const activateDocumentTypeController = async (req, res) => {
    try {
        const status = req.body.status;
        await DocumentType.findByIdAndUpdate(req.params.documentTypeId, { $set: { status: status } });
        if (status === true) {
            res.status(200).json({ code: 200, message: 'Loại văn bản đã được kích hoạt' });
        } else {
            res.status(200).json({ code: 200, message: 'Loại văn bản đã bị vô hiệu hóa' });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete document type controller
export const deleteDocumentTypeController = async (req, res) => {
    try {
        const documentType = await DocumentType.findById(req.params.documentTypeId);
        if (!documentType) return res.status(404).json({ code: 404, message: 'Không tìm thấy loại văn bản' });

        await DocumentType.findByIdAndDelete(req.params.documentTypeId);
        res.status(200).json({ code: 200, message: 'Loại văn bản đã được xóa thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete many document type permanently controller
export const deleteManyDocumentTypeController = async (req, res) => {
    try {
        const arrayId = req.body.arrayId;
        await DocumentType.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những loại văn bản được chọn đã bị xóa vĩnh viễn',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all list document type and pagination controller
export const getAllDocumentTypeController = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 5;

        const skip = (page - 1) * 5;

        const documentTypes = await DocumentType.find(
            search ? { documentTypeName: { $regex: search, $options: 'i' } } : {},
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const allDocumentTypes = await DocumentType.find(
            search ? { documentTypeName: { $regex: search, $options: 'i' } } : {},
        );

        res.status(200).json({
            code: 200,
            message: 'Successfully',
            data: documentTypes,
            allDocumentTypes: allDocumentTypes,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get document type by ID controller
export const getDocumentTypeByIdController = async (req, res) => {
    try {
        const documentType = await DocumentType.findById(req.params.documentTypeId);
        if (!documentType) return res.status(404).json({ code: 404, message: 'Không tìm thấy loại văn bản' });
        res.status(200).json({ code: 200, data: documentType });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

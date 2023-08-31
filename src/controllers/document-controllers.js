import Document from '../models/Document.js';
import User from '../models/User.js';

// Create document controller
export const createDocumentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const existNumber = await Document.findOne({ number: req.body.number });
        const existCode = await Document.findOne({ code: req.body.code });
        if (existNumber) return res.status(403).json({ code: 403, message: 'Số văn bản không được trùng' });
        if (existCode) return res.status(403).json({ code: 403, message: 'Số ký hiệu không được trùng' });
        const newDocument = new Document(req.body);

        await newDocument.save();
        res.status(200).json({ code: 200, message: 'Văn bản được tạo thành công', data: newDocument });
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
        const documentId = req.params.documentId;
        const files = req.files;

        if (!files) return res.status(400).json({ code: 400, message: 'Hãy chọn ít nhất 1 file' });

        const fileUrls = files.map((file) => {
            return process.env.BASE_URL + `/static/${file.filename}`;
        });

        const iterator = fileUrls.values();

        for (const value of iterator) {
            await Document.findOneAndUpdate({ _id: documentId }, { $push: { attachFiles: value } });
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
        const document = await Document.findById(req.params.documentId);
        const attachFiles = document.attachFiles.filter((item) => item !== filename);
        await Document.findByIdAndUpdate(req.params.documentId, { attachFiles: attachFiles });
        res.status(200).json({ code: 200, message: 'Xóa file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Upload document controller
export const updateDocumentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        const documentUpdate = await Document.findByIdAndUpdate(
            req.params.documentId,
            {
                $set: { ...req.body, assignTo: [...document.assignTo, ...req.body.assignTo] },
            },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Văn bản được cặp nhật thành công', data: documentUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change document status controller
export const changeDocumentStatusController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const documentStatus = req.body.documentStatus;
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        const documentUpdate = await Document.findByIdAndUpdate(
            req.params.documentId,
            {
                $set: { status: documentStatus },
            },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Thay đổi trạng thái văn bản thành công', data: documentUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change document current location controller
export const changeDocumentLocationController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const documentLocation = req.body.documentLocation;
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        const documentUpdate = await Document.findByIdAndUpdate(
            req.params.documentId,
            {
                $set: { currentLocation: documentLocation },
            },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Chuyển vị trí văn bản thành công', data: documentUpdate });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete document controller
export const deleteDocumentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        await Document.findByIdAndDelete(req.params.documentId);
        res.status(200).json({ code: 200, message: 'Văn bản đã được xóa thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete many documents controller
export const deleteManyDocumentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const arrayId = req.body.arrayId;
        await Document.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những văn bản được chọn đã bị xóa',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all document controller
export const getAllDocumentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        let { page, limit, documentName, note, code, type, status, level, issuedDate, documentIn, sender } = req.query;
        const queryFilters = {};

        if (documentName) {
            queryFilters.documentName = { $regex: documentName, $options: 'i' };
        }

        if (note) {
            queryFilters.note = { $regex: note, $options: 'i' };
        }

        if (code) {
            queryFilters.code = { $regex: code, $options: 'i' };
        }

        if (type) {
            queryFilters.type = type;
        }

        if (status) {
            queryFilters.status = status;
        }

        if (level) {
            queryFilters.level = level;
        }

        if (issuedDate) {
            queryFilters.issuedDate = issuedDate;
        }

        if (documentIn) {
            queryFilters.documentIn = documentIn;
        }

        if (sender) {
            queryFilters.sender = sender;
        }

        if (!page) page = 1;
        if (!limit) limit = 5;
        const skip = (page - 1) * limit;

        const documents = await Document.find(queryFilters).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const allDocuments = await Document.find(queryFilters);

        const allDocumentIn = allDocuments.filter((adci) => adci.documentIn === true);
        const allDocumentOut = allDocuments.filter((adco) => adco.documentIn === false);

        const memberDocuments = documents.filter((item) => item.assignTo.find((mem) => mem.value === req.user._id));
        const allMemberDocumentIn = allDocumentIn.filter((item) =>
            item.assignTo.find((mem) => mem.value === req.user._id),
        );

        res.status(200).json({
            code: 200,
            documents: req.user.role === 'Member' ? memberDocuments : documents,
            allDocuments: allDocuments,
            allDocumentIn: req.user.role === 'Member' ? allMemberDocumentIn : allDocumentIn,
            allDocumentOut: allDocumentOut,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get document by ID route
export const getDocumentByIdController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });
        // const getFinalDocument = () => {
        //     if (
        //         req.user.role === 'Admin' ||
        //         req.user.role === 'Moderator' ||
        //         document?.assignTo?.find((mem) => mem.value === req.user._id)
        //     ) {
        //         return document;
        //     } else {
        //         return res.status(403).json({ code: 403, message: 'Không có quyền truy cặp' });
        //     }
        // };
        if (
            req.user.role === 'Admin' ||
            req.user.role === 'Moderator' ||
            document?.assignTo?.find((mem) => mem.value === req.user._id)
        ) {
            res.status(200).json({
                code: 200,
                data: document,
            });
        } else {
            res.status(403).json({ code: 403, message: 'Không có quyền truy cặp' });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

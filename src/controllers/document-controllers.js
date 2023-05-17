import Document from '../models/Document.js';

// Create document controller
export const createDocumentController = async (req, res) => {
    try {
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
        const documentId = req.params.documentId;
        const files = req.files;

        if (!files) return res.status(400).json({ code: 400, message: 'Hãy chọn ít nhất 1 file' });

        const fileUrls = files.map((file) => {
            return process.env.BASE_URL + `/static/${file.filename}`;
        });

        await Document.findOneAndUpdate({ _id: documentId }, { attachFiles: fileUrls });
        res.status(200).json({ code: 200, message: 'Tải file thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Upload document controller
export const updateDocumentController = async (req, res) => {
    try {
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        const documentUpdate = await Document.findByIdAndUpdate(
            req.params.documentId,
            {
                $set: req.body,
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

// Delete permanently document controller
export const deleteDocumentController = async (req, res) => {
    try {
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });

        await Document.findByIdAndDelete(req.params.documentId);
        res.status(200).json({ code: 200, message: 'Văn bản đã được xóa thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all document controller
export const getAllDocumentController = async (req, res) => {
    try {
        const documents = await Document.find({}).sort({ createdAt: -1 });
        res.status(200).json({ code: 200, data: documents });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get document by ID route
export const getDocumentByIdController = async (req, res) => {
    try {
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ code: 404, message: 'Không tìm thấy văn bản' });
        res.status(200).json({ code: 200, data: document });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

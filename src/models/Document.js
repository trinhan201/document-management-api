import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
    {
        documentName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        sendDate: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
        },
        documentIn: {
            type: Boolean,
            required: true,
        },
        code: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 200,
            trim: true,
            unique: true,
        },
        sender: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500,
            trim: true,
        },
        issuedDate: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            default: 'Bình thường',
        },
        status: {
            type: String,
            default: 'Khởi tạo',
        },
        note: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        currentLocation: {
            type: String,
            trim: true,
        },
        attachFiles: {
            type: Array,
            trim: true,
            default: [],
        },
        isHaveTask: {
            type: Boolean,
            default: false,
        },
        assignTo: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Document', DocumentSchema);

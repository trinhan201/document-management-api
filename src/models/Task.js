import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        taskName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500,
            trim: true,
        },
        dueDate: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            default: 'Bình thường',
        },
        progress: {
            type: String,
            default: 'Khởi tạo',
        },
        refLink: {
            type: String,
            required: true,
            trim: true,
        },
        desc: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
        attachFiles: {
            type: Array,
            trim: true,
            default: [],
        },
        assignTo: {
            type: Array,
            trim: true,
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Task', TaskSchema);

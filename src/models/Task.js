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
        type: {
            type: String,
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
            default: 'Đang xử lý',
        },
        status: {
            type: String,
            required: true,
            default: 'Còn hạn',
        },
        refLink: {
            type: String,
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
        leader: {
            type: Object,
        },
        assignTo: {
            type: Array,
            trim: true,
            default: [],
        },
        resources: {
            type: Array,
            default: [],
        },
        isUndo: {
            type: Object,
            default: {
                flag: false,
                msg: '',
            },
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Task', TaskSchema);

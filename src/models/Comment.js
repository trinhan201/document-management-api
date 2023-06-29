import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        taskId: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Comment', CommentSchema);

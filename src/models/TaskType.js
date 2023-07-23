import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskTypeSchema = new Schema(
    {
        taskType: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('TaskType', TaskTypeSchema);

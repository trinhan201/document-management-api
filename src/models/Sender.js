import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SenderSchema = new Schema(
    {
        sender: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Sender', SenderSchema);

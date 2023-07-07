import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReqChangeInfoSchema = new Schema(
    {
        userId: {
            type: String,
            trim: true,
        },
        dataToChange: {
            type: Object,
            default: {},
        },
        status: {
            type: String,
            default: 'pending',
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('ReqChangeInfo', ReqChangeInfoSchema);

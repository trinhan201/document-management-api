import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        notification: {
            type: String,
            trim: true,
        },
        userId: {
            type: String,
            trim: true,
        },
        linkTask: {
            type: String,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Notification', NotificationSchema);

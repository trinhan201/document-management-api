import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 100,
            trim: true,
        },
        gender: {
            type: String,
            trim: true,
        },
        birthDate: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            trim: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: 'Member',
        },
        refreshTokens: {
            type: Array,
            default: [],
        },
        isActived: {
            type: Boolean,
            default: false,
        },
        isReqChangeInfo: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);

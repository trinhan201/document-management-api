import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DocumentTypeSchema = new Schema(
    {
        documentTypeName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
            trim: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        note: {
            type: String,
            maxlength: 100,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('DocumentType', DocumentTypeSchema);

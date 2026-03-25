import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    targetId: {
        type: String, // Can be a server ID, user ID etc.
    },
    type: {
        type: String,
        enum: ['AUTH', 'SERVER', 'USER', 'SYSTEM'],
        default: 'SYSTEM',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);

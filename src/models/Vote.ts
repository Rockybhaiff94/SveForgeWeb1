import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    serverId: {
        type: String,
        required: true,
        index: true,
    },
    votedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index to quickly check if a user voted for a specific server recently
VoteSchema.index({ userId: 1, serverId: 1 });

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);

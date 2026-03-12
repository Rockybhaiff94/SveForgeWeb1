import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
    serverName: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        default: 25565,
    },
    ownerId: {
        type: String,
        required: true,
    },
    gameType: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    ratingAverage: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    votes: {
        type: Number,
        default: 0,
    },
    votesLast7Days: {
        type: Number,
        default: 0,
    },
    trendingScore: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
    players: {
        type: Number,
        default: 0,
    },
    lastBumpAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Server || mongoose.model('Server', ServerSchema);

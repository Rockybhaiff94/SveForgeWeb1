import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['visit', 'server_click', 'vote', 'join_click'],
        required: true,
    },
    serverId: {
        type: String,
        index: true,
    },
    userId: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    }
});

// Index for efficiently querying time-series data per server
AnalyticsSchema.index({ serverId: 1, eventType: 1, timestamp: -1 });

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);

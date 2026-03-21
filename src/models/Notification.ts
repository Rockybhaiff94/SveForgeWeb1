import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Maps to User._id or discordId
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info',
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

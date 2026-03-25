import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // allows multiple documents with null/missing email
    },
    password: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'OWNER', 'ADMIN', 'DEV', 'MOD'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

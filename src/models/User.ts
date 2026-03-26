import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: false }, // Optional for those without verified discord emails
  password: { type: String, required: false },
  name: { type: String, required: false },
  username: { type: String, required: false },
  discordId: { type: String, required: false, sparse: true, unique: true },
  avatar: { type: String, required: false },
  accessToken: { type: String, required: false },
  role: { 
    type: String, 
    enum: ['OWNER', 'ADMIN', 'DEV', 'MOD', 'USER', 'user'], 
    default: 'USER' 
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'SHADOW_BANNED'],
    default: 'ACTIVE'
  },
  ips: [{ type: String }],
  loginHistory: [{
    ip: String,
    userAgent: String,
    date: { type: Date, default: Date.now }
  }],
  tokenVersion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

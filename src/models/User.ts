import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['OWNER', 'ADMIN', 'DEV', 'MOD', 'USER'], 
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

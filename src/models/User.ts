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
    enum: ['ACTIVE', 'SUSPENDED', 'BANNED'],
    default: 'ACTIVE'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

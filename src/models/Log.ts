import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'ACTION'], default: 'INFO' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);

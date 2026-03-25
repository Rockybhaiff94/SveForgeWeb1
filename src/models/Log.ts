import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'ACTION'], default: 'INFO' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorRole: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  targetType: { type: String, enum: ['User', 'Server', 'System', 'Report', 'Config'], required: true, default: 'System' },
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  ipAddress: { type: String },
  details: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);

import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'STARTING', 'STOPPING'],
    default: 'OFFLINE'
  },
  ram: { type: Number, default: 1024 }, // MB
  cpu: { type: Number, default: 1 }, // Cores
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Server || mongoose.model('Server', ServerSchema);

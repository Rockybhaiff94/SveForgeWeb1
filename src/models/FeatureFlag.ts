import mongoose from 'mongoose';

const FeatureFlagSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  description: { type: String },
  isEnabled: { type: Boolean, default: false },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.FeatureFlag || mongoose.model('FeatureFlag', FeatureFlagSchema);

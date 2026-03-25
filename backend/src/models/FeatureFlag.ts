import { Schema, model, Document } from 'mongoose';

export interface IFeatureFlag extends Document {
  key: string;
  isEnabled: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureFlagSchema = new Schema<IFeatureFlag>({
  key: { type: String, required: true, unique: true },
  isEnabled: { type: Boolean, default: false },
  description: { type: String }
}, { timestamps: true });

export const FeatureFlag = model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema);

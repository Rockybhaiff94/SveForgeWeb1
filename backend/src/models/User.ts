import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  username: string;
  role: 'OWNER' | 'ADMIN' | 'DEV' | 'MOD' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'SHADOW_BANNED';
  tokenVersion: number;
  permissions: {
    can_ban_user: boolean;
    can_delete_server: boolean;
    can_view_logs: boolean;
    can_bypass_ratelimits: boolean;
  };
  lastLoginIp?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: false }, // Optional for OAuth users
  username: { type: String, required: false }, // Optional
  role: { type: String, enum: ['OWNER', 'ADMIN', 'DEV', 'MOD', 'USER', 'user'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'SHADOW_BANNED'], default: 'ACTIVE' },
  tokenVersion: { type: Number, default: 0 },
  permissions: {
    can_ban_user: { type: Boolean, default: false },
    can_delete_server: { type: Boolean, default: false },
    can_view_logs: { type: Boolean, default: false },
    can_bypass_ratelimits: { type: Boolean, default: false },
  },
  lastLoginIp: { type: String },
  lastLoginAt: { type: Date }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);

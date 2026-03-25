import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'ACTION';
  userId: Schema.Types.ObjectId;
  actorRole: string;
  targetId?: string;
  targetType?: string;
  ipAddress?: string;
  details?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  action: { type: String, required: true, index: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'ACTION'], default: 'INFO', index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actorRole: { type: String },
  targetId: { type: String, index: true },
  targetType: { type: String },
  ipAddress: { type: String, index: true },
  details: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Background cleanup index (TTL 90 days for example)
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

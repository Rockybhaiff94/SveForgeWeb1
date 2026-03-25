import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId?: Schema.Types.ObjectId;
  targetId: string;
  targetType: 'User' | 'Server' | 'Message';
  reason: string;
  details?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  assignedTo?: Schema.Types.ObjectId;
  moderationScore: number;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User' },
  targetId: { type: String, required: true, index: true },
  targetType: { type: String, enum: ['User', 'Server', 'Message'], required: true },
  reason: { type: String, required: true },
  details: { type: String },
  status: { type: String, enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'], default: 'PENDING', index: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  moderationScore: { type: Number, default: 0 },
  resolutionNotes: { type: String }
}, { timestamps: true });

export const Report = model<IReport>('Report', ReportSchema);

import { Schema, model, Document } from 'mongoose';

export interface IServer extends Document {
  name: string;
  ownerId: Schema.Types.ObjectId;
  status: 'ONLINE' | 'OFFLINE' | 'STARTING' | 'STOPPING' | 'MAINTENANCE';
  ram: number;
  cpu: number;
  moderators: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ServerSchema = new Schema<IServer>({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['ONLINE', 'OFFLINE', 'STARTING', 'STOPPING', 'MAINTENANCE'], default: 'OFFLINE' },
  ram: { type: Number, default: 1024 },
  cpu: { type: Number, default: 1 },
  moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const Server = model<IServer>('Server', ServerSchema);

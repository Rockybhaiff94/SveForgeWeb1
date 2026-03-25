import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
  description: { type: String }
});

export default mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);

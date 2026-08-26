import mongoose from 'mongoose';

const projectFileSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  name: { type: String, required: true },
  originalName: { type: String },
  url: { type: String, required: true },
  fileType: { type: String, default: 'document' },
  mimeType: { type: String, default: 'application/octet-stream' },
  size: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: 'general' }, // 'design', 'code', 'document', 'asset'
}, {
  timestamps: true
});

export const ProjectFile = mongoose.model('ProjectFile', projectFileSchema);

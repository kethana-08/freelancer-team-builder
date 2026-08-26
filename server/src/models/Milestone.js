import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'approved', 'paid'],
    default: 'pending'
  },
  deliverableNote: { type: String, default: '' },
  deliverableUrls: [{ type: String }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  paidAt: { type: Date },
  order: { type: Number, default: 1 }
}, {
  timestamps: true
});

export const Milestone = mongoose.model('Milestone', milestoneSchema);

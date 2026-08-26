import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: [
      'project_created',
      'team_invited',
      'member_joined',
      'member_left',
      'task_created',
      'task_updated',
      'task_status_changed',
      'task_deleted',
      'file_uploaded',
      'milestone_created',
      'milestone_submitted',
      'milestone_approved',
      'milestone_paid',
      'project_status_changed'
    ],
    required: true
  },
  details: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

export const Activity = mongoose.model('Activity', activitySchema);

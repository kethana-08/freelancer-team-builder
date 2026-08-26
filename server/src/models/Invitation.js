import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  proposedRole: { type: String, default: 'Team Specialist' },
  proposedRate: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  },
  matchedSkills: [{ type: String }],
  compatibilityScore: { type: Number, default: 85 },
  message: { type: String, default: 'You have been matched and invited to join our project team!' },
  respondedAt: { type: Date }
}, {
  timestamps: true
});

export const Invitation = mongoose.model('Invitation', invitationSchema);

import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'UI/UX Design', 'DevOps & Cloud', 'Data & AI', 'QA & Testing', 'Management'],
    default: 'Frontend'
  },
  popular: { type: Boolean, default: false },
  description: { type: String, default: '' },
}, {
  timestamps: true
});

export const Skill = mongoose.model('Skill', skillSchema);

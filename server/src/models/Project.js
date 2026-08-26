import mongoose from 'mongoose';

const requiredSkillSchema = new mongoose.Schema({
  skill: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  minProficiency: { type: Number, default: 60, min: 0, max: 100 },
  weight: { type: Number, default: 2.0 }, // calculated: high = 3.0, med = 2.0, low = 1.0
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roleInProject: { type: String, default: 'Team Member' },
  hourlyRate: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['invited', 'accepted', 'declined', 'removed'], default: 'accepted' },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Fullstack Web Development' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  budget: {
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
    hourlyLimit: { type: Number, default: 150 }
  },

  timeline: {
    durationWeeks: { type: Number, default: 4 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    targetDelivery: { type: String, default: '1 month' }
  },

  requiredSkills: [requiredSkillSchema],
  targetTeamSize: { type: Number, default: 3, min: 1, max: 10 },
  
  status: {
    type: String,
    enum: ['draft', 'matching', 'inviting', 'active', 'completed', 'on_hold', 'archived'],
    default: 'matching'
  },

  teamMembers: [teamMemberSchema],
  
  // Stored recommendation snapshots
  recommendations: [{
    presetName: String, // 'Balanced (Recommended)', 'Budget Optimized', 'Elite Squad'
    compatibilityScore: Number,
    averageExperience: Number,
    totalHourlyRate: Number,
    highlights: [String],
    warnings: [String],
    skillCoverage: [{
      skill: String,
      coveredProficiency: Number,
      coveredByFreelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      coveredByName: String
    }],
    members: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      assignedRole: String,
      matchScore: Number,
      rate: Number,
      matchedSkills: [String]
    }]
  }],

  progress: { type: Number, default: 0, min: 0, max: 100 },
  repositoryUrl: { type: String, default: '' },
  liveDemoUrl: { type: String, default: '' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Project = mongoose.model('Project', projectSchema);

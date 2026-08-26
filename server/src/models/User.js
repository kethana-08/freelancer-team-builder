import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillItemSchema = new mongoose.Schema({
  skill: { type: String, required: true, trim: true },
  proficiency: { type: Number, required: true, min: 0, max: 100 }, // 0 to 100%
  years: { type: Number, default: 1 },
  category: { type: String, default: 'Engineering' },
}, { _id: false });

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  image: { type: String, default: '' },
  tags: [{ type: String }],
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'freelancer' },
  avatar: { type: String, default: '' },
  title: { type: String, default: 'Software Professional' },
  bio: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  
  // Freelancer specific fields
  skills: [skillItemSchema],
  experienceYears: { type: Number, default: 3 },
  hourlyRate: { type: Number, default: 45 },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 12 },
  completedProjects: { type: Number, default: 8 },
  availability: {
    hoursPerWeek: { type: Number, default: 40 },
    status: { type: String, enum: ['available', 'partially_available', 'busy'], default: 'available' },
    availableFrom: { type: Date, default: Date.now }
  },
  portfolio: [portfolioItemSchema],
  githubUrl: { type: String, default: '' },
  githubStats: {
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    topLanguages: [{ type: String }]
  },
  preferredProjectTypes: [{ type: String }],
  
  // Client specific fields
  company: { type: String, default: '' },
  industry: { type: String, default: '' },
  totalProjectsCreated: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);

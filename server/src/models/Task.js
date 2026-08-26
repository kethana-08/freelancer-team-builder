import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  estimatedHours: { type: Number, default: 4 },
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);

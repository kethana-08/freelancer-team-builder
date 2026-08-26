import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  attachments: [{
    name: String,
    url: String,
    fileType: String,
    size: Number,
  }],
  reactions: [{
    emoji: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  isSystemMessage: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Message = mongoose.model('Message', messageSchema);

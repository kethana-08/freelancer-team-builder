import { Message } from '../models/Message.js';
import { Project } from '../models/Project.js';

export const getProjectMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { limit = 100 } = req.query;

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'name email avatar role title')
      .sort('createdAt')
      .limit(Number(limit));

    res.json({
      success: true,
      count: messages.length,
      data: { messages }
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { text, attachments } = req.body;

    if ((!text || !text.trim()) && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message content or attachment is required.' });
    }

    const message = await Message.create({
      project: projectId,
      sender: req.user._id,
      text: text || '',
      attachments: Array.isArray(attachments) ? attachments : [],
      isSystemMessage: false
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar role title');

    // Return to sender (client app will also broadcast to socket room)
    res.status(201).json({
      success: true,
      data: { message: populatedMessage }
    });
  } catch (err) {
    next(err);
  }
};

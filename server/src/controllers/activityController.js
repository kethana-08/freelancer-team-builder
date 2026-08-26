import { Activity } from '../models/Activity.js';

export const getProjectActivities = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { limit = 50 } = req.query;

    const activities = await Activity.find({ project: projectId })
      .populate('user', 'name email avatar role title')
      .sort('-createdAt')
      .limit(Number(limit));

    res.json({
      success: true,
      count: activities.length,
      data: { activities }
    });
  } catch (err) {
    next(err);
  }
};

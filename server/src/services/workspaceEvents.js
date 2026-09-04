import { Activity } from '../models/Activity.js';

export const emitToProject = (req, projectId, event, data = {}) => {
  req.app.get('socketService')?.emitToProject(projectId, event, {
    projectId: projectId.toString(),
    ...data
  });
};

export const createWorkspaceActivity = async (req, projectId, action, details, metadata = {}) => {
  const activity = await Activity.create({
    project: projectId,
    user: req.user._id,
    action,
    details,
    metadata
  });

  const populatedActivity = await Activity.findById(activity._id)
    .populate('user', 'name email avatar role title');

  emitToProject(req, projectId, 'workspace:activity_created', {
    activity: populatedActivity
  });

  return populatedActivity;
};
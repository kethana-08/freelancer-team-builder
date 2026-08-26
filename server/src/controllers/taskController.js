import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Activity } from '../models/Activity.js';

export const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .sort('order createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate, estimatedHours, tags, subtasks } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const task = await Task.create({
      project: projectId,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours ? Number(estimatedHours) : 4,
      tags: tags || [],
      subtasks: subtasks || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar');

    // Recalculate project progress
    const allTasks = await Task.find({ project: projectId });
    const doneTasks = allTasks.filter(t => t.status === 'done');
    const progress = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;
    project.progress = progress;
    await project.save();

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'task_created',
      details: `${req.user.name} created task "${task.title}"`
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task: populatedTask, projectProgress: progress }
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo', 'dueDate', 'estimatedHours', 'tags', 'subtasks', 'order'];
    const prevStatus = task.status;

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    // If status changed, recalculate project progress & log activity
    if (req.body.status && req.body.status !== prevStatus) {
      const allTasks = await Task.find({ project: task.project });
      const doneTasks = allTasks.filter(t => t.status === 'done');
      const progress = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;
      await Project.findByIdAndUpdate(task.project, { progress });

      await Activity.create({
        project: task.project,
        user: req.user._id,
        action: 'task_status_changed',
        details: `${req.user.name} moved "${task.title}" to ${task.status.replace('_', ' ')}`
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully.',
      data: { task: populatedTask }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const projectId = task.project;
    const taskTitle = task.title;

    await task.deleteOne();

    // Recalculate progress
    const allTasks = await Task.find({ project: projectId });
    const doneTasks = allTasks.filter(t => t.status === 'done');
    const progress = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;
    await Project.findByIdAndUpdate(projectId, { progress });

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'task_deleted',
      details: `${req.user.name} deleted task "${taskTitle}"`
    });

    res.json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

export const addTaskComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    });

    await task.save();

    const populatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email avatar title')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      message: 'Comment added.',
      data: { task: populatedTask }
    });
  } catch (err) {
    next(err);
  }
};

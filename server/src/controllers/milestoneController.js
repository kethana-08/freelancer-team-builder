import { Milestone } from '../models/Milestone.js';
import { Project } from '../models/Project.js';
import { Activity } from '../models/Activity.js';
import { createWorkspaceActivity, emitToProject } from '../services/workspaceEvents.js';

export const getMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.find({ project: projectId })
      .populate('submittedBy', 'name avatar')
      .sort('order createdAt');

    res.json({
      success: true,
      count: milestones.length,
      data: { milestones }
    });
  } catch (err) {
    next(err);
  }
};

export const createMilestone = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, amount, dueDate, order } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const milestone = await Milestone.create({
      project: projectId,
      title,
      description: description || '',
      amount: Number(amount) || 500,
      dueDate: dueDate || null,
      order: order ? Number(order) : 1,
      status: 'pending'
    });

    await createWorkspaceActivity(
      req,
      projectId,
      'milestone_created',
      `${req.user.name} created milestone "${milestone.title}" ($${milestone.amount})`
    );
    emitToProject(req, projectId, 'workspace:milestone_created', { milestone });

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully.',
      data: { milestone }
    });
  } catch (err) {
    next(err);
  }
};

export const submitDeliverable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliverableNote, deliverableUrls } = req.body;

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    milestone.status = 'submitted';
    milestone.deliverableNote = deliverableNote || '';
    milestone.deliverableUrls = Array.isArray(deliverableUrls) ? deliverableUrls : [];
    milestone.submittedBy = req.user._id;
    milestone.submittedAt = new Date();

    await milestone.save();

    await createWorkspaceActivity(
      req,
      milestone.project,
      'milestone_submitted',
      `${req.user.name} submitted deliverables for "${milestone.title}"`
    );
    emitToProject(req, milestone.project, 'workspace:milestone_updated', { milestone });
    emitToProject(req, milestone.project, 'workspace:milestone_status_changed', { milestone });

    res.json({
      success: true,
      message: 'Deliverables submitted for client review.',
      data: { milestone }
    });
  } catch (err) {
    next(err);
  }
};

export const approveMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    const project = await Project.findById(milestone.project);
    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only project client can approve milestones.' });
    }

    milestone.status = 'approved';
    milestone.approvedAt = new Date();
    milestone.paidAt = new Date();
    await milestone.save();

    await createWorkspaceActivity(
      req,
      milestone.project,
      'milestone_approved',
      `${req.user.name} approved & released payment for "${milestone.title}" ($${milestone.amount})`
    );
    emitToProject(req, milestone.project, 'workspace:milestone_updated', { milestone });
    emitToProject(req, milestone.project, 'workspace:milestone_status_changed', { milestone });

    res.json({
      success: true,
      message: 'Milestone approved and payment released.',
      data: { milestone }
    });
  } catch (err) {
    next(err);
  }
};

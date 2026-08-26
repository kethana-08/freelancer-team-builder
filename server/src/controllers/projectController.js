import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Invitation } from '../models/Invitation.js';
import { Activity } from '../models/Activity.js';
import { findOptimalTeams } from '../services/matchingEngine.js';

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      timeline,
      requiredSkills,
      targetTeamSize
    } = req.body;

    const project = await Project.create({
      title,
      description,
      category: category || 'Web Development',
      client: req.user._id,
      budget: {
        total: budget?.total || 5000,
        currency: budget?.currency || 'USD',
        type: budget?.type || 'fixed',
        hourlyLimit: budget?.hourlyLimit || 150
      },
      timeline: {
        durationWeeks: timeline?.durationWeeks || 4,
        targetDelivery: timeline?.targetDelivery || '1 month'
      },
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      targetTeamSize: targetTeamSize ? Number(targetTeamSize) : 3,
      status: 'matching'
    });

    // Run team matching engine immediately
    const freelancers = await User.find({ role: 'freelancer', isActive: true });
    if (freelancers.length > 0) {
      const recommendations = await findOptimalTeams(project, freelancers);
      project.recommendations = recommendations;
      await project.save();
    }

    // Log activity
    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'project_created',
      details: `Project "${project.title}" created by ${req.user.name}`
    });

    // Increment client's project count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalProjectsCreated: 1 } });

    res.status(201).json({
      success: true,
      message: 'Project created and team matching completed.',
      data: { project }
    });
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    let query = {};
    const { status, category, search } = req.query;

    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'freelancer') {
      query['teamMembers.user'] = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('client', 'name email avatar company')
      .populate('teamMembers.user', 'name email avatar title hourlyRate rating skills')
      .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: { projects }
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email avatar company industry')
      .populate('teamMembers.user', 'name email avatar title hourlyRate rating skills experienceYears availability githubUrl')
      .populate('recommendations.members.user', 'name email avatar title hourlyRate rating skills');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Permission check
    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this project.' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'budget', 'timeline', 'status', 'repositoryUrl', 'liveDemoUrl', 'progress'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'project_status_changed',
      details: `Project details or status updated to "${project.status}" by ${req.user.name}`
    });

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: { project }
    });
  } catch (err) {
    next(err);
  }
};

export const inviteTeam = async (req, res, next) => {
  try {
    const { members, message } = req.body; // array of { userId, role, rate, matchedSkills, compatibilityScore }
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to invite team members.' });
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, message: 'No team members provided for invitation.' });
    }

    const createdInvitations = [];

    for (const m of members) {
      const freelancerId = m.userId || m.user?._id || m.user;
      if (!freelancerId) continue;

      // Check if already invited
      let existingInvite = await Invitation.findOne({
        project: project._id,
        freelancer: freelancerId,
        status: { $in: ['pending', 'accepted'] }
      });

      if (!existingInvite) {
        const invite = await Invitation.create({
          project: project._id,
          client: req.user._id,
          freelancer: freelancerId,
          proposedRole: m.assignedRole || m.role || 'Team Specialist',
          proposedRate: m.rate || 50,
          matchedSkills: m.matchedSkills || [],
          compatibilityScore: m.matchScore || 85,
          message: message || `You have been selected to join the "${project.title}" project team!`
        });
        createdInvitations.push(invite);

        // Also add placeholder to project.teamMembers with 'invited' status
        const isMember = project.teamMembers.some(tm => tm.user.toString() === freelancerId.toString());
        if (!isMember) {
          project.teamMembers.push({
            user: freelancerId,
            roleInProject: m.assignedRole || m.role || 'Team Specialist',
            hourlyRate: m.rate || 50,
            status: 'invited'
          });
        }
      }
    }

    project.status = 'inviting';
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'team_invited',
      details: `${req.user.name} sent invitations to ${createdInvitations.length} team members`
    });

    res.json({
      success: true,
      message: `Invitations successfully dispatched to ${createdInvitations.length} freelancers.`,
      data: { invitations: createdInvitations, project }
    });
  } catch (err) {
    next(err);
  }
};

export const removeTeamMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members.' });
    }

    project.teamMembers = project.teamMembers.filter(m => m.user.toString() !== memberId.toString());
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'member_left',
      details: `Team member removed from project by ${req.user.name}`
    });

    res.json({
      success: true,
      message: 'Member removed from team.',
      data: { project }
    });
  } catch (err) {
    next(err);
  }
};

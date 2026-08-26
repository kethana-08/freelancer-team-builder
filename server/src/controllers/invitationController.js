import { Invitation } from '../models/Invitation.js';
import { Project } from '../models/Project.js';
import { Message } from '../models/Message.js';
import { Activity } from '../models/Activity.js';

export const getMyInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.find({ freelancer: req.user._id })
      .populate('project', 'title description category budget timeline status requiredSkills')
      .populate('client', 'name email avatar company')
      .sort('-createdAt');

    res.json({
      success: true,
      count: invitations.length,
      data: { invitations }
    });
  } catch (err) {
    next(err);
  }
};

export const respondToInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accepted' | 'declined'

    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be accepted or declined.' });
    }

    const invitation = await Invitation.findOne({
      _id: id,
      freelancer: req.user._id
    }).populate('project');

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found.' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Invitation has already been ${invitation.status}.` });
    }

    invitation.status = action;
    invitation.respondedAt = new Date();
    await invitation.save();

    const project = await Project.findById(invitation.project._id);

    if (action === 'accepted') {
      // Update team member status in project
      const memberIndex = project.teamMembers.findIndex(
        m => m.user.toString() === req.user._id.toString()
      );

      if (memberIndex >= 0) {
        project.teamMembers[memberIndex].status = 'accepted';
        project.teamMembers[memberIndex].roleInProject = invitation.proposedRole;
        project.teamMembers[memberIndex].hourlyRate = invitation.proposedRate;
      } else {
        project.teamMembers.push({
          user: req.user._id,
          roleInProject: invitation.proposedRole,
          hourlyRate: invitation.proposedRate,
          status: 'accepted'
        });
      }

      // Transition project to active if it was matching or inviting
      if (['matching', 'inviting', 'draft'].includes(project.status)) {
        project.status = 'active';
      }

      await project.save();

      // Post system announcement message in project chat
      await Message.create({
        project: project._id,
        sender: req.user._id,
        text: `🎉 ${req.user.name} has joined the team as ${invitation.proposedRole}!`,
        isSystemMessage: true
      });

      // Log activity
      await Activity.create({
        project: project._id,
        user: req.user._id,
        action: 'member_joined',
        details: `${req.user.name} accepted the invitation and joined the project team`
      });
    } else {
      // Remove from team members or set declined
      project.teamMembers = project.teamMembers.filter(
        m => m.user.toString() !== req.user._id.toString()
      );
      await project.save();
    }

    res.json({
      success: true,
      message: `Invitation ${action} successfully.`,
      data: { invitation, project }
    });
  } catch (err) {
    next(err);
  }
};

import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Skill } from '../models/Skill.js';
import { Invitation } from '../models/Invitation.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalClients = await User.countDocuments({ role: 'client' });
    
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const totalTasks = await Task.countDocuments();
    const totalInvitations = await Invitation.countDocuments();

    // Calculate platform volume
    const projects = await Project.find({}, 'budget.total');
    const platformVolume = projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0);

    const skillsCount = await Skill.countDocuments();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalFreelancers,
          totalClients,
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          totalInvitations,
          platformVolume,
          skillsCount
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { role, search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status !== undefined && status !== '') query.isActive = status === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully.`,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminProjects = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('client', 'name email avatar company')
      .populate('teamMembers.user', 'name title avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort('category name');
    res.json({
      success: true,
      count: skills.length,
      data: { skills }
    });
  } catch (err) {
    next(err);
  }
};

export const createAdminSkill = async (req, res, next) => {
  try {
    const { name, category, popular, description } = req.body;

    const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists.' });
    }

    const skill = await Skill.create({
      name,
      category: category || 'Frontend',
      popular: !!popular,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully.',
      data: { skill }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.json({
      success: true,
      message: 'Skill removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

import { User } from '../models/User.js';
import { cloudinary, isConfigured as isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

export const getFreelancers = async (req, res, next) => {
  try {
    const { search, skill, minRate, maxRate, availability, sort = '-rating' } = req.query;

    const query = { role: 'freelancer', isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { 'skills.skill': { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query['skills.skill'] = { $regex: skill, $options: 'i' };
    }

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    if (availability) {
      query['availability.status'] = availability;
    }

    const freelancers = await User.find(query).sort(sort).limit(50);

    res.json({
      success: true,
      count: freelancers.length,
      data: { freelancers }
    });
  } catch (err) {
    next(err);
  }
};

export const getFreelancerById = async (req, res, next) => {
  try {
    const freelancer = await User.findOne({ _id: req.params.id, role: 'freelancer' });
    if (!freelancer) {
      return res.status(404).json({ success: false, message: 'Freelancer not found.' });
    }

    res.json({
      success: true,
      data: { freelancer }
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'title', 'bio', 'location', 'skills', 'experienceYears',
      'hourlyRate', 'availability', 'portfolio', 'githubUrl',
      'preferredProjectTypes', 'company', 'industry'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If GitHub URL was updated, mock / fetch simple repo stats
    if (updates.githubUrl) {
      const username = updates.githubUrl.split('github.com/')[1]?.replace(/\/.*$/, '');
      if (username) {
        updates.githubStats = {
          publicRepos: 18,
          followers: 45,
          topLanguages: ['TypeScript', 'JavaScript', 'Python', 'Go']
        };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updatedUser }
    });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    let avatarUrl = `/uploads/${req.file.filename}`;

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'freelancer-team-builder/avatars',
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
        });
        avatarUrl = result.secure_url;
        // Clean up local temp file
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local file:', cloudErr.message);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully.',
      data: { avatarUrl, user }
    });
  } catch (err) {
    next(err);
  }
};

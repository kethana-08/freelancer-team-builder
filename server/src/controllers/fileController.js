import { ProjectFile } from '../models/ProjectFile.js';
import { Project } from '../models/Project.js';
import { Activity } from '../models/Activity.js';
import { cloudinary, isConfigured as isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const getProjectFiles = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const files = await ProjectFile.find({ project: projectId })
      .populate('uploadedBy', 'name avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: files.length,
      data: { files }
    });
  } catch (err) {
    next(err);
  }
};

export const uploadProjectFile = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { category = 'general' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a file.' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;

    if (isCloudinaryConfigured) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: `freelancer-team-builder/projects/${projectId}`,
          resource_type: 'auto'
        });
        fileUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.warn('Cloudinary upload fallback to local storage:', cloudErr.message);
      }
    }

    // Determine simplified file type
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'document';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) fileType = 'image';
    else if (['.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.html', '.css'].includes(ext)) fileType = 'code';
    else if (['.zip', '.rar', '.tar', '.gz'].includes(ext)) fileType = 'archive';
    else if (['.pdf'].includes(ext)) fileType = 'pdf';

    const projectFile = await ProjectFile.create({
      project: projectId,
      name: req.file.originalname,
      originalName: req.file.originalname,
      url: fileUrl,
      fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      category
    });

    const populatedFile = await ProjectFile.findById(projectFile._id)
      .populate('uploadedBy', 'name avatar');

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'file_uploaded',
      details: `${req.user.name} uploaded file "${projectFile.name}"`
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      data: { file: populatedFile }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProjectFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await ProjectFile.findById(id);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    await file.deleteOne();

    res.json({
      success: true,
      message: 'File removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

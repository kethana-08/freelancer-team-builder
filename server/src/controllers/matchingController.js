import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { findOptimalTeams } from '../services/matchingEngine.js';

export const runTeamMatch = async (req, res, next) => {
  try {
    const { projectId, requiredSkills, budget, targetTeamSize, timeline } = req.body;

    let projectData = null;

    if (projectId) {
      projectData = await Project.findById(projectId);
      if (!projectData) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }
    } else {
      // Direct parameters passed for on-the-fly preview
      projectData = {
        requiredSkills: requiredSkills || [],
        budget: budget || { total: 5000, hourlyLimit: 150 },
        targetTeamSize: Number(targetTeamSize) || 3,
        timeline: timeline || { durationWeeks: 4 }
      };
    }

    // Fetch all active freelancers from database
    const freelancers = await User.find({ role: 'freelancer', isActive: true });

    if (!freelancers || freelancers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No active freelancers found in the database.',
        data: { recommendations: [] }
      });
    }

    const recommendations = await findOptimalTeams(projectData, freelancers);

    // If matching was run on an existing saved project, optionally cache/persist recommendations
    if (projectId && projectData) {
      projectData.recommendations = recommendations;
      await projectData.save();
    }

    res.json({
      success: true,
      data: {
        recommendations,
        totalFreelancersAnalyzed: freelancers.length,
        requiredSkills: projectData.requiredSkills
      }
    });
  } catch (err) {
    next(err);
  }
};

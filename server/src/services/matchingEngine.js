/**
 * Intelligent Team Matching Engine for Freelancer Team Builder
 * 
 * Formulates and solves team composition using priority-weighted multi-attribute
 * optimization, skill synergy maximization, and budget constraints.
 */

// Helper to calculate priority weight
export const getPriorityWeight = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high':
      return 3.0;
    case 'medium':
      return 2.0;
    case 'low':
      return 1.0;
    default:
      return 2.0;
  }
};

/**
 * Normalized string matching for skills (handles React vs React.js vs reactjs)
 */
export const normalizeSkillName = (str) => {
  if (str === null || str === undefined) return '';
  return String(str).trim().toLowerCase().replace(/[\s\-_.]/g, '').replace(/js$/, '');
};

const getSkillName = (skill) => {
  if (typeof skill === 'string') return skill;
  if (skill && typeof skill === 'object') return skill.skill || skill.name || '';
  return '';
};

const getSkillEntries = (skills) => {
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') return [skills];
  if (skills && typeof skills === 'object') return Object.entries(skills).map(([skill, proficiency]) => ({ skill, proficiency }));
  return [];
};

/**
 * Find freelancer proficiency in a specific skill
 */
export const getFreelancerProficiency = (freelancer, targetSkill) => {
  const targetNorm = normalizeSkillName(targetSkill);
  if (!targetNorm) return 0;

  const matchedSkill = getSkillEntries(freelancer.skills).find(skill => {
    return normalizeSkillName(getSkillName(skill)) === targetNorm;
  });

  if (!matchedSkill) return 0;
  if (typeof matchedSkill === 'string') return 70;
  const proficiency = Number(matchedSkill.proficiency);
  return Number.isFinite(proficiency) ? proficiency : 70;
};

/**
 * Score individual freelancer for a set of required skills
 */
export const scoreIndividualFreelancer = (freelancer, requiredSkills, hourlyBudgetLimit = 150) => {
  if (!requiredSkills || requiredSkills.length === 0) return { score: 50, matchedSkills: [] };

  let totalWeightedProficiency = 0;
  let totalWeight = 0;
  const matchedSkills = [];

  requiredSkills.forEach(req => {
    const skill = getSkillName(req);
    const priority = typeof req === 'object' ? req.priority : undefined;
    const weight = getPriorityWeight(priority);
    const prof = getFreelancerProficiency(freelancer, skill);
    totalWeightedProficiency += prof * weight;
    totalWeight += weight * 100; // max possible

    if (prof > 0) {
      matchedSkills.push({
        skill,
        proficiency: prof,
        priority
      });
    }
  });

  const skillScore = totalWeight > 0 ? (totalWeightedProficiency / totalWeight) * 100 : 0;

  // Experience multiplier (0.85 to 1.15)
  const expYears = freelancer.experienceYears || 3;
  const expMultiplier = Math.min(1.15, Math.max(0.85, 0.85 + expYears * 0.04));

  // Rating multiplier (0.85 to 1.15)
  const rating = freelancer.rating || 4.5;
  const ratingMultiplier = Math.min(1.15, Math.max(0.85, (rating / 5.0) * 1.1));

  // Availability score (0.5 to 1.0)
  const availStatus = freelancer.availability?.status || 'available';
  const availMultiplier = availStatus === 'available' ? 1.0 : availStatus === 'partially_available' ? 0.85 : 0.5;

  // Budget fit multiplier
  const rate = freelancer.hourlyRate || 50;
  const budgetMultiplier = rate <= hourlyBudgetLimit ? 1.0 : Math.max(0.7, 1 - (rate - hourlyBudgetLimit) / (hourlyBudgetLimit * 2));

  const compositeScore = Math.round(
    skillScore * 0.55 * expMultiplier * ratingMultiplier * availMultiplier * budgetMultiplier +
    (rating / 5.0) * 20 +
    Math.min(freelancer.completedProjects || 0, 15) * 1.5
  );

  return {
    score: Math.min(99, Math.max(15, compositeScore)),
    skillScore: Math.round(skillScore),
    matchedSkills,
    rate,
    expYears,
    rating,
    availStatus
  };
};

/**
 * Generate Combinations of array of size K
 */
function getCombinations(array, k) {
  if (k === 0) return [[]];
  if (array.length === 0) return [];
  const head = array[0];
  const tail = array.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

/**
 * Evaluate a team combination against project requirements
 */
export const evaluateTeam = (teamMembers, requiredSkills, projectBudget = {}) => {
  const teamSize = teamMembers.length;
  if (teamSize === 0) return null;

  let totalWeight = 0;
  let totalTeamCoveredWeight = 0;
  const skillCoverage = [];
  const missingSkills = [];
  const weakSkills = [];

  requiredSkills.forEach(req => {
    const skill = getSkillName(req);
    const priority = typeof req === 'object' ? req.priority : undefined;
    const weight = getPriorityWeight(priority);
    totalWeight += weight * 100;

    let bestProf = 0;
    let bestMember = null;

    teamMembers.forEach(member => {
      const prof = getFreelancerProficiency(member, skill);
      if (prof > bestProf) {
        bestProf = prof;
        bestMember = member;
      }
    });

    totalTeamCoveredWeight += bestProf * weight;

    skillCoverage.push({
      skill,
      priority,
      requiredMin: typeof req === 'object' ? (req.minProficiency || 60) : 60,
      coveredProficiency: bestProf,
      coveredByFreelancerId: bestMember?._id || bestMember?.id,
      coveredByName: bestMember?.name || 'Unassigned',
      isSatisfied: bestProf >= (typeof req === 'object' ? (req.minProficiency || 60) : 60)
    });

    if (bestProf === 0) {
      missingSkills.push(skill);
    } else if (bestProf < (typeof req === 'object' ? (req.minProficiency || 60) : 60)) {
      weakSkills.push({ skill, prof: bestProf });
    }
  });

  const skillCoverageScore = totalWeight > 0 ? (totalTeamCoveredWeight / totalWeight) * 100 : 0;
  
  // Aggregate Metrics
  const totalHourlyRate = teamMembers.reduce((sum, m) => sum + (m.hourlyRate || 45), 0);
  const avgExperience = +(teamMembers.reduce((sum, m) => sum + (m.experienceYears || 3), 0) / teamSize).toFixed(1);
  const avgRating = +(teamMembers.reduce((sum, m) => sum + (m.rating || 4.8), 0) / teamSize).toFixed(2);
  const immediateAvailableCount = teamMembers.filter(m => (m.availability?.status || 'available') === 'available').length;

  // Budget fit penalty / bonus
  const hourlyBudgetLimit = projectBudget.hourlyLimit || 200;
  let budgetScore = 100;
  if (totalHourlyRate > hourlyBudgetLimit) {
    budgetScore = Math.max(40, 100 - (totalHourlyRate - hourlyBudgetLimit) * 1.2);
  }

  // Composite Compatibility Score
  const compatibilityScore = Math.round(
    skillCoverageScore * 0.55 +
    (avgRating / 5.0) * 15 +
    Math.min(avgExperience / 8.0, 1.0) * 15 +
    (immediateAvailableCount / teamSize) * 10 +
    (budgetScore / 100) * 5
  );

  // Generate Highlights (Pros)
  const highlights = [];
  if (missingSkills.length === 0 && weakSkills.length === 0) {
    highlights.push('✓ 100% of required skills covered with high proficiency');
  } else if (missingSkills.length === 0) {
    highlights.push(`✓ All ${requiredSkills.length} required skill areas covered`);
  }

  if (immediateAvailableCount === teamSize) {
    highlights.push(`✓ All ${teamSize} members available immediately`);
  } else if (immediateAvailableCount > 0) {
    highlights.push(`✓ ${immediateAvailableCount} of ${teamSize} members ready to start immediately`);
  }

  if (avgExperience >= 4.0) {
    highlights.push(`✓ Strong senior leadership with average ${avgExperience} years experience`);
  }

  if (totalHourlyRate <= hourlyBudgetLimit) {
    highlights.push(`✓ Total team rate ($${totalHourlyRate}/hr) is within target budget`);
  }

  if (avgRating >= 4.8) {
    highlights.push(`✓ Outstanding collective client rating (${avgRating} ★)`);
  }

  // Generate Warnings / Tradeoffs (Cons)
  const warnings = [];
  if (missingSkills.length > 0) {
    warnings.push(`⚠ Missing direct coverage for: ${missingSkills.join(', ')}`);
  }
  weakSkills.forEach(ws => {
    warnings.push(`⚠ ${ws.skill} coverage is at ${ws.prof}% (below desired threshold)`);
  });
  if (totalHourlyRate > hourlyBudgetLimit) {
    warnings.push(`⚠ Combined rate ($${totalHourlyRate}/hr) exceeds preferred target ($${hourlyBudgetLimit}/hr)`);
  }
  if (immediateAvailableCount < teamSize) {
    warnings.push(`⚠ ${teamSize - immediateAvailableCount} member(s) have partial or scheduled availability`);
  }

  // Determine intelligent role titles for each member
  const membersWithRoles = teamMembers.map(member => {
    let topSkillMatch = '';
    let topProf = 0;
    requiredSkills.forEach(req => {
      const p = getFreelancerProficiency(member, getSkillName(req));
      if (p > topProf) {
        topProf = p;
        topSkillMatch = getSkillName(req);
      }
    });

    const roleTitle = member.title || (topSkillMatch ? `${topSkillMatch} Specialist` : 'Core Engineer');
    
    return {
      user: member,
      assignedRole: roleTitle,
      matchScore: scoreIndividualFreelancer(member, requiredSkills, hourlyBudgetLimit).score,
      rate: member.hourlyRate || 45,
      matchedSkills: getSkillEntries(member.skills)
        .map(getSkillName)
        .filter(skill => requiredSkills.some(req =>
          normalizeSkillName(getSkillName(req)) === normalizeSkillName(skill)
        ))
    };
  });

  return {
    compatibilityScore: Math.min(99, Math.max(20, compatibilityScore)),
    skillCoverageScore: Math.round(skillCoverageScore),
    totalHourlyRate,
    averageExperience: avgExperience,
    averageRating: avgRating,
    immediateAvailableCount,
    highlights,
    warnings,
    skillCoverage,
    members: membersWithRoles
  };
};

/**
 * Main Team Matching Function
 * Generates 3 curated presets: Balanced (Best), Budget Optimized, and Elite Squad
 */
export const findOptimalTeams = async (project, allFreelancers) => {
  const requiredSkills = project.requiredSkills || [];
  const targetSize = Math.min(Math.max(project.targetTeamSize || 3, 1), 6);
  const budget = project.budget || {};

  if (!allFreelancers || allFreelancers.length === 0) {
    return [];
  }

  // 1. Filter active freelancers and pre-score individuals
  const scoredFreelancers = allFreelancers
    .filter(f => f.isActive !== false)
    .map(f => ({
      freelancer: f,
      ...scoreIndividualFreelancer(f, requiredSkills, budget.hourlyLimit)
    }))
    .sort((a, b) => b.score - a.score);

  // If pool is smaller than target team size, return whatever we have as best possible
  if (scoredFreelancers.length <= targetSize) {
    const rawMembers = scoredFreelancers.map(s => s.freelancer);
    const evalResult = evaluateTeam(rawMembers, requiredSkills, budget);
    if (!evalResult) return [];
    return [{
      presetName: 'Optimal Available Team',
      description: 'The top available match for your requirements from active platform freelancers.',
      ...evalResult
    }];
  }

  // Evaluate team composition across every scored eligible freelancer.
  const candidatePool = scoredFreelancers.map(s => s.freelancer);

  // Generate candidate combinations of size targetSize
  const allCombos = getCombinations(candidatePool, targetSize);
  
  const evaluatedCombos = allCombos.map(combo => ({
    teamMembers: combo,
    evalResult: evaluateTeam(combo, requiredSkills, budget)
  })).filter(c => c.evalResult !== null);

  // Sort by composite compatibility score descending
  evaluatedCombos.sort((a, b) => b.evalResult.compatibilityScore - a.evalResult.compatibilityScore);

  const presets = [];

  // Preset 1: Balanced Recommendation (Best Overall)
  if (evaluatedCombos.length > 0) {
    const best = evaluatedCombos[0];
    presets.push({
      presetName: 'Balanced Recommendation',
      badge: 'Best Match',
      description: 'Maximizes overall skill coverage, chemistry, verified client ratings, and budget efficiency.',
      ...best.evalResult
    });
  }

  // Preset 2: Budget Saver (Lowest hourly rate with decent coverage >= 70%)
  const budgetOptions = [...evaluatedCombos]
    .filter(c => c.evalResult.skillCoverageScore >= 65)
    .sort((a, b) => a.evalResult.totalHourlyRate - b.evalResult.totalHourlyRate);

  if (budgetOptions.length > 0) {
    const budgetPick = budgetOptions[0];
    // Don't duplicate if it's identical members to preset 1
    const isSameAsFirst = presets[0] && 
      budgetPick.evalResult.members.map(m => m.user._id?.toString()).sort().join() === 
      presets[0].members.map(m => m.user._id?.toString()).sort().join();

    if (!isSameAsFirst || budgetOptions.length === 1) {
      presets.push({
        presetName: 'Budget Optimized',
        badge: 'Cost Saver',
        description: 'Delivers required capabilities at the most cost-effective combined hourly rate.',
        ...budgetPick.evalResult
      });
    } else if (budgetOptions[1]) {
      presets.push({
        presetName: 'Budget Optimized',
        badge: 'Cost Saver',
        description: 'Delivers required capabilities at the most cost-effective combined hourly rate.',
        ...budgetOptions[1].evalResult
      });
    }
  }

  // Preset 3: Elite Velocity Squad (Highest average experience & rating)
  const eliteOptions = [...evaluatedCombos]
    .sort((a, b) => (b.evalResult.averageExperience * 2 + b.evalResult.averageRating * 5) - 
                    (a.evalResult.averageExperience * 2 + a.evalResult.averageRating * 5));

  if (eliteOptions.length > 0) {
    const elitePick = eliteOptions[0];
    const isDuplicate = presets.some(p => 
      p.members.map(m => m.user._id?.toString()).sort().join() === 
      elitePick.evalResult.members.map(m => m.user._id?.toString()).sort().join()
    );

    if (!isDuplicate) {
      presets.push({
        presetName: 'Elite Velocity Squad',
        badge: 'Top Tier',
        description: 'Seasoned senior specialists and top-rated veterans for rapid, mission-critical delivery.',
        ...elitePick.evalResult
      });
    } else if (eliteOptions[1]) {
      presets.push({
        presetName: 'Elite Velocity Squad',
        badge: 'Top Tier',
        description: 'Seasoned senior specialists and top-rated veterans for rapid, mission-critical delivery.',
        ...eliteOptions[1].evalResult
      });
    }
  }

  return presets;
};

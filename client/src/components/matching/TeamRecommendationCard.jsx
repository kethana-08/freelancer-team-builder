import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Users, DollarSign, Clock, Star, Sparkles, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { RadarSkillChart } from './RadarSkillChart';
import { Modal } from '../common/Modal';

export const TeamRecommendationCard = ({
  recommendation,
  onInvite,
  isInviting = false,
  isCurrentTeam = false,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRadar, setShowRadar] = useState(false);

  const {
    presetName = 'Recommended Squad',
    badge = 'Optimal',
    description,
    compatibilityScore = 92,
    skillCoverageScore = 90,
    totalHourlyRate = 180,
    averageExperience = 5.2,
    averageRating = 4.9,
    immediateAvailableCount = 3,
    highlights = [],
    warnings = [],
    skillCoverage = [],
    members = []
  } = recommendation;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 shadow-glow-emerald';
    if (score >= 75) return 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40 shadow-glow';
    return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl relative overflow-hidden group">
      {/* Top Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Badge variant="primary" size="sm" icon={Sparkles}>
              {badge || 'Recommended'}
            </Badge>
            <h3 className="text-xl font-bold text-slate-100">{presetName}</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {description || 'Assembled to maximize total project skill coverage and budget harmony.'}
          </p>
        </div>

        {/* Compatibility Score Widget */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Project Compatibility
            </div>
            <div className="text-xs text-slate-400">Combined AI Metric</div>
          </div>
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border font-bold text-2xl ${getScoreColor(compatibilityScore)}`}>
            {compatibilityScore}%
          </div>
        </div>
      </div>

      {/* Metric Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-800/80 my-1">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Combined Rate
          </div>
          <div className="text-base font-bold text-slate-200">
            ${totalHourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Avg Experience
          </div>
          <div className="text-base font-bold text-slate-200">
            {averageExperience} <span className="text-xs font-normal text-slate-400">years</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Avg Rating
          </div>
          <div className="text-base font-bold text-slate-200">
            {averageRating} <span className="text-xs font-normal text-slate-400">★</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Availability
          </div>
          <div className="text-base font-bold text-slate-200">
            {immediateAvailableCount}/{members.length} <span className="text-xs font-normal text-slate-400">Ready</span>
          </div>
        </div>
      </div>

      {/* Highlights & Warnings Breakdown (Algorithm Explainability) */}
      <div className="py-4 space-y-2 border-b border-slate-800/80">
        {highlights.slice(0, 3).map((h, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{h}</span>
          </div>
        ))}
        {warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{w}</span>
          </div>
        ))}
      </div>

      {/* Team Members Roster Cards */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Squad ({members.length} Members)
          </span>
          <button
            type="button"
            onClick={() => setShowRadar(!showRadar)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            {showRadar ? 'Hide Skill Radar' : 'View Skill Radar'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Optional Embedded Skill Radar */}
        {showRadar && (
          <div className="mb-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="text-xs font-semibold text-slate-300 mb-2">Skill Coverage Matrix</div>
            <RadarSkillChart skillCoverage={skillCoverage} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {members.map((m, idx) => {
            const u = m.user || {};
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Avatar src={u.avatar} name={u.name} size="md" status={u.availability?.status || 'available'} />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-slate-200 truncate">{u.name}</div>
                      <div className="text-xs text-indigo-400 font-medium truncate">{m.assignedRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2 mb-2 pb-2 border-b border-slate-800/60">
                    <span>${m.rate || u.hourlyRate}/hr</span>
                    <span className="text-amber-400 font-medium">{u.rating || 4.9} ★ ({u.completedProjects || 12} done)</span>
                  </div>

                  {/* Matched Skills Chips */}
                  <div className="flex flex-wrap gap-1">
                    {(m.matchedSkills || []).slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Individual Match:</span>
                  <span className="font-bold text-emerald-400">{m.matchScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDetailsModal(true)}
        >
          View Full Breakdown
        </Button>

        {onInvite && !isCurrentTeam && (
          <Button
            variant="primary"
            size="md"
            icon={Zap}
            loading={isInviting}
            onClick={() => onInvite(recommendation)}
          >
            Invite This Team
          </Button>
        )}

        {isCurrentTeam && (
          <Badge variant="emerald" size="md" icon={ShieldCheck}>
            Active Team
          </Badge>
        )}
      </div>

      {/* Full Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`${presetName} — Detailed Breakdown`}
        subtitle="Complete algorithm evaluation, skill coverage, and member capabilities."
        maxWidth="max-w-3xl"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            {onInvite && (
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  onInvite(recommendation);
                }}
              >
                Confirm & Invite Team
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* Radar Chart */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Skill Coverage Radar</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <RadarSkillChart skillCoverage={skillCoverage} />
            </div>
          </div>

          {/* Skill Coverage Table */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Required Skills Coverage Table</h4>
            <div className="table-container bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-3">Skill</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Target Min</th>
                    <th className="p-3">Team Coverage</th>
                    <th className="p-3">Primary Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {skillCoverage.map((sc, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-medium text-slate-100">{sc.skill}</td>
                      <td className="p-3">
                        <Badge variant={sc.priority} size="xs">{sc.priority}</Badge>
                      </td>
                      <td className="p-3 font-mono">{sc.requiredMin}%</td>
                      <td className="p-3">
                        <span className={`font-bold font-mono ${sc.coveredProficiency >= sc.requiredMin ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sc.coveredProficiency}%
                        </span>
                      </td>
                      <td className="p-3 text-indigo-400">{sc.coveredByName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

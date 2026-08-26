import React from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';

export const OverviewTab = ({ project, tasks = [], milestones = [], activities = [], onTabChange }) => {
  const completedTasks = tasks.filter(t => t.status === 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const approvedMilestones = milestones.filter(m => m.status === 'approved' || m.status === 'paid');
  const paidAmount = approvedMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const nextMilestone = milestones.find(m => m.status === 'in_progress' || m.status === 'pending');

  const teamMembers = project?.teamMembers || [];

  return (
    <div className="space-y-6">
      {/* Top Hero Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="xs">{project?.category || 'Development'}</Badge>
              <Badge
                variant={project?.status === 'active' ? 'emerald' : 'amber'}
                size="xs"
              >
                {(project?.status || 'Active').toUpperCase()}
              </Badge>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{project?.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {project?.description}
            </p>
          </div>

          {/* Progress Circle / Box */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl shrink-0 min-w-[200px]">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>Overall Completion</span>
              <span className="text-indigo-400 font-mono text-base font-bold">{project?.progress || 0}%</span>
            </div>
            <ProgressBar value={project?.progress || 0} max={100} showValue={false} size="md" color="accent" />
            <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span>{completedTasks.length} of {tasks.length} tasks done</span>
              <span>{approvedMilestones.length}/{milestones.length} milestones</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Budget Spent</div>
            <div className="text-lg font-bold text-slate-100">
              ${paidAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ ${project?.budget?.total?.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ${(project?.budget?.total - paidAmount).toLocaleString()} remaining
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tasks Completed</div>
            <div className="text-lg font-bold text-slate-100">
              {completedTasks.length} <span className="text-xs font-normal text-slate-500">/ {tasks.length} Total</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              {inProgressTasks.length} actively in progress
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Team Squad</div>
            <div className="text-lg font-bold text-slate-100">
              {teamMembers.length} Members
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target size: {project?.targetTeamSize || 3}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Estimated Delivery</div>
            <div className="text-lg font-bold text-slate-100">
              {project?.timeline?.targetDelivery || `${project?.timeline?.durationWeeks || 4} Weeks`}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Started {new Date(project?.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Team Squad Roster + Next Milestone / Quick Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Team Members Roster */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Project Team Roster
            </h3>
            <button
              onClick={() => onTabChange('team')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Manage Team <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
                No active team members yet.
              </div>
            ) : (
              teamMembers.map((member, idx) => {
                const u = member.user || {};
                const memberTasks = tasks.filter(t => t.assignedTo?._id === u._id);
                const memberDoneTasks = memberTasks.filter(t => t.status === 'done');

                return (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar src={u.avatar} name={u.name} size="md" status="online" />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-200 truncate">{u.name}</div>
                        <div className="text-xs text-indigo-400 font-medium truncate">
                          {member.roleInProject || u.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-right shrink-0">
                      <div>
                        <div className="text-slate-400">Assigned Tasks</div>
                        <div className="font-semibold text-slate-200">
                          {memberDoneTasks.length} / {memberTasks.length} done
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Rate</div>
                        <div className="font-semibold text-emerald-400">
                          ${member.hourlyRate || u.hourlyRate || 50}/hr
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* External Links Widget */}
          {(project?.repositoryUrl || project?.liveDemoUrl) && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4">
              {project?.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  GitHub Repository
                </a>
              )}
              {project?.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  Live Preview Staging
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right 5 cols: Next Milestone & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Next Milestone Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Target Milestone
              </h3>
              <button
                onClick={() => onTabChange('milestones')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                All Milestones <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextMilestone ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{nextMilestone.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{nextMilestone.description}</p>
                  </div>
                  <Badge
                    variant={nextMilestone.status === 'in_progress' ? 'amber' : 'default'}
                    size="xs"
                  >
                    {nextMilestone.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Escrow Value:</span>
                  <span className="font-bold text-emerald-400 text-sm">${nextMilestone.amount}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                All milestones are completed or approved!
              </div>
            )}
          </div>

          {/* Quick Activity Timeline Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Latest Activity
              </h3>
              <button
                onClick={() => onTabChange('activity')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                View Feed <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60 text-xs">
              {activities.slice(0, 4).map((act, i) => (
                <div key={i} className="py-2.5 flex items-start gap-2.5 first:pt-1 last:pb-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-200 leading-snug">{act.details}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="py-4 text-center text-slate-500">No activity logged yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Star,
  Clock,
  DollarSign,
  UserX,
  PlusCircle,
  ExternalLink,
  Github,
  Mail,
  Award
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';

export const TeamTab = ({ project, onProjectUpdate }) => {
  const { user, isClient, isAdmin } = useAuth();
  const toast = useToast();
  const [removingId, setRemovingId] = useState(null);

  const teamMembers = project?.teamMembers || [];

  const handleRemoveMember = async (memberUserId) => {
    if (!window.confirm('Are you sure you want to remove this member from the project?')) return;

    try {
      setRemovingId(memberUserId);
      await projectService.removeMember(project._id, memberUserId);
      toast.info('Member removed from project team.');
      onProjectUpdate();
    } catch (err) {
      toast.error('Failed to remove member.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Active Project Team Squad ({teamMembers.length} Members)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Optimized collaboration unit matching your required tech stack and milestone goals.
          </p>
        </div>

        {(isClient || isAdmin) && (
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="md">
              Client Admin
            </Badge>
          </div>
        )}
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member, idx) => {
          const u = member.user || {};

          return (
            <Card key={idx} className="flex flex-col justify-between relative overflow-hidden group">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.name} size="lg" status="online" />
                    <div>
                      <h4 className="font-bold text-base text-slate-100 leading-tight">{u.name}</h4>
                      <div className="text-xs font-semibold text-indigo-400 mt-0.5">
                        {member.roleInProject || u.title}
                      </div>
                    </div>
                  </div>

                  <Badge variant="emerald" size="xs">
                    {member.status || 'Accepted'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {u.bio || 'Experienced engineering specialist with verified delivery metrics.'}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs mb-4">
                  <div>
                    <span className="text-slate-500 block">Rate</span>
                    <span className="font-bold text-emerald-400">${member.hourlyRate || u.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rating</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {u.rating || 4.9} ★
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Experience</span>
                    <span className="font-bold text-slate-200">{u.experienceYears || 4} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Joined</span>
                    <span className="font-medium text-slate-400">
                      {new Date(member.joinedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Core Skills & Proficiency
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(u.skills || []).slice(0, 4).map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 text-slate-300 rounded-md flex items-center gap-1"
                      >
                        <span>{s.skill}</span>
                        <b className="text-indigo-400">{s.proficiency}%</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {u.githubUrl && (
                    <a
                      href={u.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg hover:bg-slate-700 transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                    {u.email}
                  </span>
                </div>

                {(isClient || isAdmin) && u._id !== user?._id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs px-2.5 py-1"
                    loading={removingId === u._id}
                    onClick={() => handleRemoveMember(u._id)}
                  >
                    <UserX className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

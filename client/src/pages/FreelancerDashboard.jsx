import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Briefcase,
  Star,
  DollarSign,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { ProgressBar } from '../components/common/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { projectService } from '../services/projectService';

export const FreelancerDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [invitations, setInvitations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, projRes] = await Promise.all([
        projectService.getMyInvitations(),
        projectService.getProjects()
      ]);
      setInvitations(invRes.data.invitations || []);
      setProjects(projRes.data.projects || []);
    } catch (err) {
      toast.error('Failed to load freelancer dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async (invitationId, action) => {
    try {
      setRespondingId(invitationId);
      await projectService.respondToInvitation(invitationId, action);
      toast.success(`Invitation ${action === 'accepted' ? 'accepted! Welcome to the squad.' : 'declined.'}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update invitation status.');
    } finally {
      setRespondingId(null);
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Freelancer Header Strip */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.name} size="xl" status="online" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <Badge variant="emerald" size="xs">
                {user?.availability?.status === 'available' ? 'Available' : 'Busy'}
              </Badge>
            </div>
            <p className="text-xs text-indigo-300 font-medium">{user?.title || 'Senior Specialist'}</p>
            <p className="text-xs text-slate-400 mt-1 max-w-lg line-clamp-1">{user?.bio}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/freelancer/profile">
            <Button variant="secondary" size="md">
              Edit Skills & Rate
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Hourly Rate
          </div>
          <div className="text-xl font-bold text-slate-100">${user?.hourlyRate || 50}/hr</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Client Rating
          </div>
          <div className="text-xl font-bold text-slate-100">{user?.rating || 4.9} ★</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Completed
          </div>
          <div className="text-xl font-bold text-slate-100">{user?.completedProjects || 8} Projects</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Bell className="w-3.5 h-3.5 text-fuchsia-400" /> Pending Invites
          </div>
          <div className="text-xl font-bold text-slate-100">{pendingInvitations.length} Pending</div>
        </Card>
      </div>

      {/* Pending Team Invitations Inbox */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Incoming Squad Invitations ({pendingInvitations.length})
          </h2>
          <span className="text-xs text-slate-400">
            Invitations formulated specifically for your skill matrix
          </span>
        </div>

        {pendingInvitations.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            No pending squad invitations. You will receive notifications when clients run matching on projects matching your skills.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingInvitations.map((inv) => {
              const proj = inv.project || {};
              const client = inv.client || {};

              return (
                <div
                  key={inv._id}
                  className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="amber" size="xs" icon={Sparkles}>
                          Team Match Request
                        </Badge>
                        <h3 className="font-bold text-base text-slate-100 mt-1">{proj.title}</h3>
                        <div className="text-xs text-slate-400">
                          Client: <b className="text-slate-200">{client.name}</b> {client.company ? `(${client.company})` : ''}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-extrabold text-emerald-400">{inv.compatibilityScore}%</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Match</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                      "{inv.message}"
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block">Proposed Role:</span>
                        <span className="font-semibold text-indigo-400">{inv.proposedRole}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Offered Rate:</span>
                        <span className="font-semibold text-emerald-400">${inv.proposedRate || 50}/hr</span>
                      </div>
                    </div>

                    {inv.matchedSkills && inv.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {inv.matchedSkills.map((s, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-400 hover:bg-rose-950/40"
                      disabled={respondingId === inv._id}
                      onClick={() => handleRespond(inv._id, 'declined')}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="emerald"
                      size="sm"
                      icon={CheckCircle2}
                      loading={respondingId === inv._id}
                      onClick={() => handleRespond(inv._id, 'accepted')}
                    >
                      Accept & Join Squad
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Projects / Workspaces */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Your Active Workspaces ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-500">
            No active project workspaces yet. Accept an invitation above to join a team.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" size="xs">{p.category}</Badge>
                    <Badge variant={p.status === 'active' ? 'emerald' : 'default'} size="xs">
                      {p.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-slate-100 mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{p.description}</p>

                  <ProgressBar value={p.progress || 0} max={100} label="Sprint Progress" size="sm" />
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={p.client?.avatar} name={p.client?.name} size="xs" />
                    <span className="text-xs text-slate-400 truncate max-w-[120px]">
                      Client: {p.client?.name}
                    </span>
                  </div>

                  <Link to={`/workspace/${p._id}`}>
                    <Button variant="primary" size="sm" icon={ArrowRight}>
                      Enter Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

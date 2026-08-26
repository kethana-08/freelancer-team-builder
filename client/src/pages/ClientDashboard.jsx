import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { ProgressBar } from '../components/common/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        toast.error('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'active');
  const matchingProjects = projects.filter(p => p.status === 'matching' || p.status === 'inviting');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-indigo-400">Client Portal</span>
            <Badge variant="primary" size="xs">Verified Founder</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Manage your synchronized freelance squads, review matching recommendations, and track active deliverables.
          </p>
        </div>

        <Link to="/projects/create">
          <Button variant="accent" size="lg" icon={PlusCircle} className="shadow-glow">
            Build New Team
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Projects</div>
            <div className="text-xl font-extrabold text-slate-100">{projects.length}</div>
            <div className="text-[11px] text-slate-500">{activeProjects.length} actively in flight</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Committed Budget</div>
            <div className="text-xl font-extrabold text-slate-100">${totalBudget.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Escrow Protected</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Matching & Inviting</div>
            <div className="text-xl font-extrabold text-slate-100">{matchingProjects.length}</div>
            <div className="text-[11px] text-slate-500">Ready for review</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Squad Specialists</div>
            <div className="text-xl font-extrabold text-slate-100">
              {projects.reduce((sum, p) => sum + (p.teamMembers?.length || 0), 0)}
            </div>
            <div className="text-[11px] text-slate-500">Across all projects</div>
          </div>
        </Card>
      </div>

      {/* Projects List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Your Projects ({projects.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click on any project to access its workspace or matching recommendations
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-100">No Projects Created Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-6">
              Create your first project and let our intelligent engine assemble the ideal freelancer squad for your requirements.
            </p>
            <Link to="/projects/create">
              <Button variant="primary" icon={PlusCircle}>
                Create & Match Team
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => {
              const teamMembers = project.teamMembers || [];
              const hasRecommendations = project.recommendations && project.recommendations.length > 0;
              const isWorkspaceActive = project.status === 'active';

              return (
                <div
                  key={project._id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg group"
                >
                  <div>
                    {/* Status and Category */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="primary" size="xs">
                        {project.category}
                      </Badge>
                      <Badge
                        variant={
                          project.status === 'active'
                            ? 'emerald'
                            : project.status === 'matching'
                            ? 'purple'
                            : project.status === 'inviting'
                            ? 'amber'
                            : 'default'
                        }
                        size="xs"
                      >
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Skills Chips with priority indicators */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.requiredSkills || []).slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <span>{s.skill}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            s.priority === 'high' ? 'bg-rose-400' : s.priority === 'medium' ? 'bg-amber-400' : 'bg-sky-400'
                          }`} />
                        </span>
                      ))}
                      {(project.requiredSkills?.length || 0) > 4 && (
                        <span className="text-[10px] px-2 py-0.5 text-slate-500">
                          +{project.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (if active) */}
                    {isWorkspaceActive && (
                      <div className="mb-4">
                        <ProgressBar
                          value={project.progress || 0}
                          max={100}
                          label="Workspace Progress"
                          size="sm"
                          color="indigo"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Team Avatars + Action Button */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {teamMembers.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                          {teamMembers.map((m, i) => (
                            <Avatar
                              key={i}
                              src={m.user?.avatar}
                              name={m.user?.name}
                              size="sm"
                              className="ring-2 ring-slate-900"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Target squad: {project.targetTeamSize || 3} members
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasRecommendations && project.status !== 'active' && (
                        <Link to={`/projects/${project._id}/matches`}>
                          <Button variant="secondary" size="sm" icon={Sparkles}>
                            Review Matches
                          </Button>
                        </Link>
                      )}

                      <Link to={`/workspace/${project._id}`}>
                        <Button variant="primary" size="sm" icon={ArrowRight}>
                          Open Workspace
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

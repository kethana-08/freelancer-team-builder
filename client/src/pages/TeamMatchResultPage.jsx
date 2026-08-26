import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Users,
  DollarSign,
  Clock,
  Layers,
  Send,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TeamRecommendationCard } from '../components/matching/TeamRecommendationCard';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { projectService } from '../services/projectService';
import { matchingService } from '../services/matchingService';

export const TeamMatchResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Invite modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTeamToInvite, setSelectedTeamToInvite] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const fetchProjectAndMatches = async () => {
      try {
        const res = await projectService.getProjectById(id);
        const p = res.data.project;
        setProject(p);

        if (p.recommendations && p.recommendations.length > 0) {
          setRecommendations(p.recommendations);
        } else {
          // Re-run matching if recommendations are empty
          const matchRes = await matchingService.runMatch({ projectId: id });
          setRecommendations(matchRes.data.recommendations || []);
        }
      } catch (err) {
        toast.error('Failed to load matching recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndMatches();
  }, [id]);

  const handleOpenInviteModal = (teamRecommendation) => {
    setSelectedTeamToInvite(teamRecommendation);
    setInviteMessage(`Hi team! You have been selected by our matching engine to build "${project?.title}". Looking forward to working together!`);
    setInviteModalOpen(true);
  };

  const handleConfirmInvite = async () => {
    if (!selectedTeamToInvite || !project) return;

    try {
      setInviting(true);
      const membersToInvite = selectedTeamToInvite.members.map(m => ({
        userId: m.user?._id || m.user?.id || m.user,
        assignedRole: m.assignedRole,
        rate: m.rate,
        matchedSkills: m.matchedSkills,
        matchScore: m.matchScore
      }));

      await projectService.inviteTeam(project._id, {
        members: membersToInvite,
        message: inviteMessage
      });

      toast.success('Team invitations successfully dispatched!');
      setInviteModalOpen(false);
      navigate(`/workspace/${project._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch invitations.');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <div className="text-sm text-slate-400 font-medium">Running Multi-Attribute Matching Engine...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link
            to="/client/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            Optimized Squad Recommendations
            <Badge variant="primary" size="xs">AI Formulated</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Project: <b className="text-slate-200">{project?.title}</b> • Budget: ${project?.budget?.total?.toLocaleString()} • Target: {project?.targetTeamSize || 3} Members
          </p>
        </div>

        <Link to={`/workspace/${project?._id}`}>
          <Button variant="secondary" size="sm" icon={Layers}>
            Open Workspace
          </Button>
        </Link>
      </div>

      {/* Preset Switcher Tabs */}
      {recommendations.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          {recommendations.map((rec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPresetIndex(idx)}
              className={`flex-1 min-w-[180px] p-3 rounded-xl text-left transition-all cursor-pointer ${
                selectedPresetIndex === idx
                  ? 'bg-indigo-600/20 border border-indigo-500 text-white shadow-glow'
                  : 'bg-slate-950/40 border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{rec.presetName}</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">{rec.compatibilityScore}%</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                ${rec.totalHourlyRate}/hr • {rec.averageExperience} yrs exp
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Recommendation Card */}
      {recommendations[selectedPresetIndex] ? (
        <TeamRecommendationCard
          recommendation={recommendations[selectedPresetIndex]}
          onInvite={handleOpenInviteModal}
          isInviting={inviting}
          isCurrentTeam={project?.status === 'active'}
        />
      ) : (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
          No team combinations met the criteria with the current talent pool. Try broadening your skill requirements or hourly budget.
        </div>
      )}

      {/* Invite Confirmation Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Confirm Squad Invitation Dispatch"
        subtitle={`Dispatch formal invites to all ${selectedTeamToInvite?.members?.length || 0} specialists in ${selectedTeamToInvite?.presetName}.`}
        footer={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              icon={Send}
              loading={inviting}
              onClick={handleConfirmInvite}
              className="shadow-glow"
            >
              Dispatch Invitations Now
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <div className="font-semibold text-slate-200 mb-1.5">Invited Freelancers:</div>
            <div className="space-y-1">
              {(selectedTeamToInvite?.members || []).map((m, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/60 last:border-0">
                  <span className="font-medium text-slate-200">{m.user?.name || 'Specialist'}</span>
                  <span className="text-indigo-400">{m.assignedRole} (${m.rate || 50}/hr)</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Personalized Invitation Note
            </label>
            <textarea
              rows="3"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Once freelancers accept, the project workspace will immediately activate with full Kanban tasks and Socket.IO team channel chat.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

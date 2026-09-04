import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Send,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { workspaceService } from '../../services/workspaceService';

export const MilestonesTab = ({ project, milestones = [], onMilestoneUpdate }) => {
  const { user, isClient, isFreelancer, isAdmin } = useAuth();
  const toast = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(null);

  // Create form state
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: 2000,
    dueDate: '',
  });

  // Submit deliverable state
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [approving, setApproving] = useState(false);

  const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const approvedAmount = milestones
    .filter(m => m.status === 'approved' || m.status === 'paid')
    .reduce((sum, m) => sum + (m.amount || 0), 0);

  const completionPercentage = totalAmount > 0 ? Math.round((approvedAmount / totalAmount) * 100) : 0;

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) {
      toast.error('Milestone title is required.');
      return;
    }

    try {
      await workspaceService.createMilestone(project._id, newMilestone);
      toast.success('Milestone created!');
      setCreateModalOpen(false);
      setNewMilestone({ title: '', description: '', amount: 2000, dueDate: '' });
      onMilestoneUpdate();
    } catch (err) {
      toast.error('Failed to create milestone.');
    }
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!activeMilestone) return;

    try {
      setSubmitting(true);
      await workspaceService.submitDeliverable(activeMilestone._id, {
        deliverableNote,
        deliverableUrls: deliverableUrl ? [deliverableUrl] : []
      });
      toast.success('Deliverables submitted to client for approval!');
      setSubmitModalOpen(false);
      setDeliverableNote('');
      setDeliverableUrl('');
      onMilestoneUpdate();
    } catch (err) {
      toast.error('Failed to submit deliverable.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveMilestone = async (milestoneId) => {
    if (!window.confirm('Approve milestone and release payment funds to the team?')) return;

    try {
      setApproving(true);
      await workspaceService.approveMilestone(milestoneId);
      toast.success('Milestone approved! Payment released successfully.');
      onMilestoneUpdate();
    } catch (err) {
      toast.error('Failed to approve milestone.');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="workspace-milestones-banner bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Project Milestones & Escrow Budget
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Structured deliverable phases with milestone-based payment releases.
            </p>
          </div>

          {(isClient || isAdmin) && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setCreateModalOpen(true)}
            >
              Add Milestone
            </Button>
          )}
        </div>

        {/* Financial Progress */}
        <div className="workspace-progress bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
            <span>Escrow Released Progress</span>
            <span className="font-mono text-emerald-400 font-bold">
              ${approvedAmount.toLocaleString()} / ${totalAmount.toLocaleString()} ({completionPercentage}%)
            </span>
          </div>
          <ProgressBar value={completionPercentage} max={100} showValue={false} color="emerald" size="md" />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((ms, idx) => {
          const isApproved = ms.status === 'approved' || ms.status === 'paid';
          const isSubmitted = ms.status === 'submitted';

          return (
            <div
              key={ms._id}
              className={`rounded-2xl border p-5 transition-all ${
                isApproved
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isSubmitted
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isApproved
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h4 className="font-bold text-base text-slate-100">{ms.title}</h4>
                      <Badge
                        variant={
                          isApproved
                            ? 'emerald'
                            : isSubmitted
                            ? 'amber'
                            : ms.status === 'in_progress'
                            ? 'primary'
                            : 'default'
                        }
                        size="xs"
                      >
                        {ms.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {ms.description || 'Deliverable milestone details and acceptance criteria.'}
                    </p>

                    {/* Submitted Deliverables preview */}
                    {ms.deliverableNote && (
                      <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                        <div className="font-semibold text-slate-300 mb-1">Deliverable Note:</div>
                        <p className="text-slate-400">{ms.deliverableNote}</p>
                        {ms.deliverableUrls && ms.deliverableUrls.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {ms.deliverableUrls.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-mono text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {url}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Milestone Value</div>
                    <div className="text-xl font-extrabold text-emerald-400">
                      ${ms.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Freelancer Submit Button */}
                    {(isFreelancer || isAdmin) && !isApproved && !isSubmitted && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Send}
                        onClick={() => {
                          setActiveMilestone(ms);
                          setSubmitModalOpen(true);
                        }}
                      >
                        Submit Deliverables
                      </Button>
                    )}

                    {/* Client Approve & Pay Button */}
                    {(isClient || isAdmin) && isSubmitted && (
                      <Button
                        variant="emerald"
                        size="sm"
                        icon={ShieldCheck}
                        loading={approving}
                        onClick={() => handleApproveMilestone(ms._id)}
                      >
                        Approve & Release (${ms.amount})
                      </Button>
                    )}

                    {isApproved && (
                      <Badge variant="emerald" size="md" icon={CheckCircle2}>
                        Paid & Released
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {milestones.length === 0 && (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No milestones created yet.
          </div>
        )}
      </div>

      {/* Create Milestone Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Project Milestone"
        subtitle="Define project phases, escrow budget, and required deliverables."
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Phase 2: Live Tracking & Payment Integration"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Scope & Deliverables
            </label>
            <textarea
              rows="3"
              placeholder="List deliverables required for approval..."
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Amount ($ USD) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={newMilestone.amount}
                onChange={(e) => setNewMilestone({ ...newMilestone, amount: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Due Date
              </label>
              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submit Deliverable Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={`Submit Deliverables for "${activeMilestone?.title}"`}
        subtitle="Notify client of completed milestone items for escrow release review."
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deliverable Summary / Handover Note *
            </label>
            <textarea
              rows="4"
              required
              placeholder="Describe what was accomplished, deployment links, testing status..."
              value={deliverableNote}
              onChange={(e) => setDeliverableNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Demo / Pull Request URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://github.com/... or https://figma.com/..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit to Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

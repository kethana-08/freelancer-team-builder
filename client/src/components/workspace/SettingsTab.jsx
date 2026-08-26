import React, { useState } from 'react';
import { Settings, Save, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';

export const SettingsTab = ({ project, onProjectUpdate }) => {
  const { user, isClient, isAdmin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Fullstack Web Development',
    status: project?.status || 'active',
    repositoryUrl: project?.repositoryUrl || '',
    liveDemoUrl: project?.liveDemoUrl || '',
  });

  const [saving, setSaving] = useState(false);

  const canEdit = isClient || isAdmin;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    try {
      setSaving(true);
      await projectService.updateProject(project._id, formData);
      toast.success('Project settings updated successfully!');
      onProjectUpdate();
    } catch (err) {
      toast.error('Failed to update project settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            Project Settings & Parameters
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure project visibility, staging deployments, and development status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Project Title
          </label>
          <input
            type="text"
            required
            disabled={!canEdit}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Project Description
          </label>
          <textarea
            rows="3"
            disabled={!canEdit}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Project Status
            </label>
            <select
              disabled={!canEdit}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            >
              <option value="matching">Matching</option>
              <option value="inviting">Inviting</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              GitHub Repository URL
            </label>
            <input
              type="url"
              disabled={!canEdit}
              placeholder="https://github.com/org/repo"
              value={formData.repositoryUrl}
              onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Live Staging / Demo URL
            </label>
            <input
              type="url"
              disabled={!canEdit}
              placeholder="https://preview.app.io"
              value={formData.liveDemoUrl}
              onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
        </div>

        {canEdit && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

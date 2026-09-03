import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  Plus,
  Trash2,
  DollarSign,
  CheckCircle2,
  XCircle,
  Tag,
  FolderPlus
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage = () => {
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeSubTab, setActiveSubTab] = useState('overview');

  // User search/filter state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // New skill state
  const [newSkillModalOpen, setNewSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, skillsRes, projRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ search: userSearch, role: userRoleFilter }),
        adminService.getSkills(),
        adminService.getProjects()
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setSkills(skillsRes.data.skills || []);
      setProjects(projRes.data.projects || []);
    } catch (err) {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRoleFilter]);

  const handleToggleUser = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      toast.success('User status updated.');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to toggle user status.');
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await adminService.createSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        popular: true
      });
      toast.success('New skill added to platform taxonomy!');
      setNewSkillModalOpen(false);
      setNewSkillName('');
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Delete this skill from taxonomy?')) return;
    try {
      await adminService.deleteSkill(skillId);
      toast.info('Skill removed.');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to delete skill.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Administration</h1>
            <Badge variant="purple" size="xs">Root Admin</Badge>
          </div>
          <p className="text-xs text-slate-400">
            System overview, user moderation, matching engine health, and skills taxonomy management.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Skills ({skills.length})
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-xl font-extrabold text-white mt-1">{stats?.totalUsers || 0}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Freelancers</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">{stats?.totalFreelancers || 0}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Clients</div>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">{stats?.totalClients || 0}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Total Projects</div>
          <div className="text-xl font-extrabold text-amber-400 mt-1">{stats?.totalProjects || 0}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Active Workspaces</div>
          <div className="text-xl font-extrabold text-purple-400 mt-1">{stats?.activeProjects || 0}</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-xs text-slate-400">Platform Volume</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            ${stats?.platformVolume ? (stats.platformVolume / 1000).toFixed(0) + 'k' : '$0'}
          </div>
        </Card>
      </div>

      {/* SUBTAB 1: Overview Dashboard */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            All Active & Formulated Projects ({projects.length})
          </h3>

          <div className="table-container bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Team Squad</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-slate-100">{p.title}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={p.client?.avatar} name={p.client?.name} size="xs" />
                        <span>{p.client?.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.status === 'active' ? 'emerald' : 'primary'} size="xs">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ${p.budget?.total?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-1.5">
                        {(p.teamMembers || []).map((m, i) => (
                          <Avatar key={i} src={m.user?.avatar} name={m.user?.name} size="xs" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Users Management */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAdminData()}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
            >
              <option value="">All Roles</option>
              <option value="client">Clients Only</option>
              <option value="freelancer">Freelancers Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>

          <div className="table-container bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size="sm" />
                        <div>
                          <div className="font-bold text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={u.role === 'admin' ? 'purple' : u.role === 'freelancer' ? 'emerald' : 'primary'}
                        size="xs"
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-300">
                      {u.title || u.company || '—'}
                    </td>
                    <td className="p-4 font-mono">
                      {u.role === 'freelancer' ? `$${u.hourlyRate}/hr` : '—'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-semibold ${u.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={u.isActive ? 'danger' : 'emerald'}
                        size="xs"
                        onClick={() => handleToggleUser(u._id)}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Skills Taxonomy Management */}
      {activeSubTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Standard Skills Taxonomy ({skills.length})</h3>
              <p className="text-xs text-slate-400">
                Skills available in the project builder and freelancer proficiency matrices.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setNewSkillModalOpen(true)}
            >
              Add New Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">{skill.name}</div>
                  <div className="text-[10px] text-indigo-400">{skill.category}</div>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill._id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Skill Modal */}
      <Modal
        isOpen={newSkillModalOpen}
        onClose={() => setNewSkillModalOpen(false)}
        title="Add Skill to Platform Taxonomy"
        subtitle="Make new skills searchable and weighable in the team matching engine."
      >
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Supabase, Rust, Solidity"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Mobile">Mobile</option>
              <option value="QA & Testing">QA & Testing</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setNewSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

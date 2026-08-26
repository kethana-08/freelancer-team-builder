import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  Plus,
  Trash2,
  Github,
  Sparkles,
  Star,
  DollarSign,
  Clock,
  ExternalLink,
  Code2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export const FreelancerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    bio: user?.bio || '',
    location: user?.location || 'Remote',
    hourlyRate: user?.hourlyRate || 50,
    experienceYears: user?.experienceYears || 4,
    availability: user?.availability || { hoursPerWeek: 40, status: 'available' },
    skills: user?.skills || [],
    githubUrl: user?.githubUrl || '',
    portfolio: user?.portfolio || [],
    preferredProjectTypes: user?.preferredProjectTypes || ['Fullstack Web Development', 'AI & Data Science']
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState(85);
  const [newSkillCat, setNewSkillCat] = useState('Frontend');

  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDesc, setNewPortfolioDesc] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        location: user.location || 'Remote',
        hourlyRate: user.hourlyRate || 50,
        experienceYears: user.experienceYears || 4,
        availability: user.availability || { hoursPerWeek: 40, status: 'available' },
        skills: user.skills || [],
        githubUrl: user.githubUrl || '',
        portfolio: user.portfolio || [],
        preferredProjectTypes: user.preferredProjectTypes || ['Fullstack Web Development']
      });
    }
  }, [user]);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const skill = {
      skill: newSkillName.trim(),
      proficiency: Number(newSkillProf),
      years: 3,
      category: newSkillCat
    };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (idx) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    }));
  };

  const handleProficiencyChange = (idx, value) => {
    const updated = [...formData.skills];
    updated[idx].proficiency = Number(value);
    setFormData(prev => ({ ...prev, skills: updated }));
  };

  const handleAddPortfolio = () => {
    if (!newPortfolioTitle.trim()) return;
    const item = {
      title: newPortfolioTitle.trim(),
      description: newPortfolioDesc.trim(),
      link: newPortfolioLink.trim(),
      tags: ['Production', 'Web']
    };
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, item]
    }));
    setNewPortfolioTitle('');
    setNewPortfolioDesc('');
    setNewPortfolioLink('');
  };

  const handleRemovePortfolio = (idx) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authService.updateProfile(formData);
      updateUser(res.data.user);
      toast.success('Profile and skill matrix updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-400" />
            Freelancer Profile & Skill Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your skills, experience, and hourly rates directly power the AI Team Matching Algorithm.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          loading={saving}
          onClick={handleSaveProfile}
          className="shadow-glow"
        >
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Core Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Bio & Engineering Experience Summary
            </label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Hourly Rate ($ USD / hr)
              </label>
              <input
                type="number"
                min="15"
                max="300"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Availability Status
              </label>
              <select
                value={formData.availability?.status || 'available'}
                onChange={(e) => setFormData({
                  ...formData,
                  availability: { ...formData.availability, status: e.target.value }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="available">Available Immediately (Full Capacity)</option>
                <option value="partially_available">Partially Available (15-20 hrs/wk)</option>
                <option value="busy">Busy / Scheduled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              GitHub Profile Link
            </label>
            <div className="relative">
              <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="url"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Skills & Proficiency Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Skills & Proficiency Matrix ({formData.skills.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust your proficiency score (0-100%) for each skill.
              </p>
            </div>
          </div>

          {/* Add Skill Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-slate-400 mb-1">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Next.js, FastAPI, Docker"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                value={newSkillCat}
                onChange={(e) => setNewSkillCat(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Prof: {newSkillProf}%</label>
              <input
                type="range"
                min="30"
                max="100"
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <Button type="button" variant="primary" size="sm" icon={Plus} onClick={handleAddSkill} className="w-full">
                Add
              </Button>
            </div>
          </div>

          {/* Existing Skills Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.skills.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-100">{s.skill}</span>
                    <span className="text-[10px] text-slate-500 ml-2">({s.category})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{s.proficiency}%</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  value={s.proficiency}
                  onChange={(e) => handleProficiencyChange(idx, e.target.value)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Portfolio Projects & Deliverables
            </h3>
          </div>

          {/* Add Portfolio Row */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Project Title"
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="url"
                placeholder="Demo or GitHub Link"
                value={newPortfolioLink}
                onChange={(e) => setNewPortfolioLink(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <textarea
              rows="2"
              placeholder="Short description of what was built and impact..."
              value={newPortfolioDesc}
              onChange={(e) => setNewPortfolioDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end">
              <Button type="button" variant="primary" size="sm" icon={Plus} onClick={handleAddPortfolio}>
                Add Portfolio Item
              </Button>
            </div>
          </div>

          {/* Existing Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.portfolio.map((p, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{p.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" /> View Project Link
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePortfolio(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

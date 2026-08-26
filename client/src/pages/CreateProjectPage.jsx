import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Calendar,
  Users,
  Layers,
  FileText
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { SkillPrioritySelector } from '../components/matching/SkillPrioritySelector';
import { useToast } from '../context/ToastContext';
import { projectService } from '../services/projectService';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fullstack Web Development',
    budgetTotal: 10000,
    hourlyLimit: 180,
    durationWeeks: 6,
    targetTeamSize: 3,
    requiredSkills: [
      { skill: 'React', priority: 'high', minProficiency: 85, weight: 3.0 },
      { skill: 'Node.js', priority: 'high', minProficiency: 80, weight: 3.0 },
      { skill: 'UI/UX Design', priority: 'medium', minProficiency: 75, weight: 2.0 },
      { skill: 'MongoDB', priority: 'medium', minProficiency: 70, weight: 2.0 },
    ]
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error('Please fill in the project title and description.');
        return;
      }
    } else if (step === 2) {
      if (formData.requiredSkills.length === 0) {
        toast.error('Please add at least one required skill.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitAndMatch = async () => {
    try {
      setLoading(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: {
          total: Number(formData.budgetTotal),
          hourlyLimit: Number(formData.hourlyLimit),
          type: 'fixed'
        },
        timeline: {
          durationWeeks: Number(formData.durationWeeks),
          targetDelivery: `${formData.durationWeeks} weeks`
        },
        targetTeamSize: Number(formData.targetTeamSize),
        requiredSkills: formData.requiredSkills
      };

      const res = await projectService.createProject(payload);
      toast.success('Project created and optimal teams assembled!');
      navigate(`/projects/${res.data.project._id}/matches`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize project matching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligent Team Builder Wizard
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Describe Your Project & Assemble Your Squad
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
          Our algorithm balances skill priority weights, individual experience, and budget constraints to formulate the top 3 complementary teams.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[
          { num: 1, label: 'Scope' },
          { num: 2, label: 'Skills & Priority' },
          { num: 3, label: 'Budget & Size' },
          { num: 4, label: 'Review & Match' }
        ].map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === s.num
                  ? 'bg-indigo-600 text-white shadow-glow ring-2 ring-indigo-400'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${step === s.num ? 'text-slate-100 font-bold' : 'text-slate-500'}`}>
              {s.label}
            </span>
            {idx < 3 && <div className="w-8 sm:w-12 h-0.5 bg-slate-800 ml-2" />}
          </div>
        ))}
      </div>

      {/* Step Form Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* STEP 1: Project Identity */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Step 1: Project Identity & Scope
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the high-level objective and description of what you're building.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. QuickBite — Next-Gen Food Delivery & Real-Time Tracking Platform"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category / Domain
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fullstack Web Development">Fullstack Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="DevOps & Cloud Infrastructure">DevOps & Cloud Infrastructure</option>
                  <option value="Fintech & Web3">Fintech & Web3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Suggested Target Squad Size
                </label>
                <select
                  value={formData.targetTeamSize}
                  onChange={(e) => setFormData({ ...formData, targetTeamSize: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value={2}>2 Members (Lean Duo)</option>
                  <option value={3}>3 Members (Standard Squad: Lead + Specialist + UI/UX)</option>
                  <option value={4}>4 Members (Cross-functional Full Team)</option>
                  <option value={5}>5 Members (High-velocity Enterprise Squad)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Detailed Project Description & Scope *
              </label>
              <textarea
                rows="5"
                required
                placeholder="Describe your vision, core features, architecture preferences, and deliverables..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Priority Weights */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Step 2: Required Skills & Priority Weights
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign High (3x), Medium (2x), or Low (1x) priority to dictate algorithm scoring weights.
              </p>
            </div>

            <SkillPrioritySelector
              skills={formData.requiredSkills}
              onChange={(updated) => setFormData({ ...formData, requiredSkills: updated })}
            />
          </div>
        )}

        {/* STEP 3: Budget & Timeline */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Step 3: Budget & Delivery Timeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Set total escrow allocation and target project duration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Total Project Budget ($ USD)</span>
                  <span className="text-emerald-400 font-mono font-bold text-base">
                    ${Number(formData.budgetTotal).toLocaleString()}
                  </span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={formData.budgetTotal}
                  onChange={(e) => setFormData({ ...formData, budgetTotal: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Combined Hourly Budget Ceiling</span>
                  <span className="text-indigo-400 font-mono font-bold text-base">
                    ${formData.hourlyLimit}/hr
                  </span>
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={formData.hourlyLimit}
                  onChange={(e) => setFormData({ ...formData, hourlyLimit: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Target Duration (Weeks)</span>
                  <span className="text-amber-400 font-mono font-bold text-base">
                    {formData.durationWeeks} Weeks
                  </span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={formData.durationWeeks}
                  onChange={(e) => setFormData({ ...formData, durationWeeks: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                />
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Target Squad Size</span>
                  <span className="text-purple-400 font-mono font-bold text-base">
                    {formData.targetTeamSize} Freelancers
                  </span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={formData.targetTeamSize}
                  onChange={(e) => setFormData({ ...formData, targetTeamSize: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Step 4: Final Summary & Matching Trigger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your parameters. Clicking proceed will run the optimization engine and generate top squad presets.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Project Title:</span>
                <span className="font-bold text-slate-100 text-sm">{formData.title}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-indigo-400">{formData.category}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Target Squad Size:</span>
                <span className="font-bold text-slate-200">{formData.targetTeamSize} Members</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Budget Allocation:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ${Number(formData.budgetTotal).toLocaleString()} (Max ${formData.hourlyLimit}/hr)
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-2 font-semibold">Priority Weighted Skills ({formData.requiredSkills.length}):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {formData.requiredSkills.map((s, idx) => (
                    <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="font-medium text-slate-200">{s.skill}</span>
                      <Badge variant={s.priority} size="xs">{s.priority.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={handleBack}>
              Previous
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="accent"
              size="lg"
              icon={Sparkles}
              loading={loading}
              onClick={handleSubmitAndMatch}
              className="shadow-glow"
            >
              Run Team Matching Engine
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

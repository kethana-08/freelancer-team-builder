import React, { useState } from 'react';
import { Plus, X, Sparkles, Check, Flame, ShieldAlert, Zap } from 'lucide-react';
import { Badge } from '../common/Badge';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'Next.js', 'UI/UX Design', 'Figma',
  'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Flutter', 'Tailwind CSS', 'LangChain & OpenAI'
];

export const SkillPrioritySelector = ({ skills = [], onChange }) => {
  const [customSkill, setCustomSkill] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('high');
  const [minProficiency, setMinProficiency] = useState(75);

  const handleAddSkill = (skillName) => {
    const trimmed = (skillName || customSkill).trim();
    if (!trimmed) return;

    // Check if already present
    if (skills.some(s => s.skill.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    const newSkill = {
      skill: trimmed,
      priority: selectedPriority,
      minProficiency: Number(minProficiency),
      weight: selectedPriority === 'high' ? 3.0 : selectedPriority === 'medium' ? 2.0 : 1.0
    };

    onChange([...skills, newSkill]);
    setCustomSkill('');
  };

  const handleRemoveSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdatePriority = (index, priority) => {
    const updated = [...skills];
    updated[index] = {
      ...updated[index],
      priority,
      weight: priority === 'high' ? 3.0 : priority === 'medium' ? 2.0 : 1.0
    };
    onChange(updated);
  };

  const handleUpdateProficiency = (index, prof) => {
    const updated = [...skills];
    updated[index] = {
      ...updated[index],
      minProficiency: Number(prof)
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Quick Add / Input Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Add Required Skills & Set Priority Weights
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Skill Name */}
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Skill or Tech Stack
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, UI/UX Design..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Priority Level
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="high">🔥 High Priority (Weight 3.0)</option>
              <option value="medium">⚡ Medium Priority (Weight 2.0)</option>
              <option value="low">💡 Low / Nice-to-have (Weight 1.0)</option>
            </select>
          </div>

          {/* Min Proficiency */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Min. Level: <span className="text-indigo-400 font-bold">{minProficiency}%</span>
            </label>
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={minProficiency}
              onChange={(e) => setMinProficiency(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Add Button */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 mb-2">Popular suggestions:</div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((item) => {
              const isAdded = skills.some(s => s.skill.toLowerCase() === item.toLowerCase());
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => !isAdded && handleAddSkill(item)}
                  disabled={isAdded}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    isAdded
                      ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-300 hover:bg-indigo-600/30 hover:text-indigo-300 hover:border-indigo-500/50 border border-slate-700/50'
                  }`}
                >
                  {isAdded && <Check className="w-3 h-3 text-emerald-400" />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Skills List with Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">
            Defined Project Skills ({skills.length})
          </span>
          <span className="text-xs text-slate-400">
            Higher priority skills will heavily weight the recommendation engine
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
            No skills added yet. Select from popular tags or enter custom stack requirements above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-slate-100 truncate">
                      {item.skill}
                    </span>
                    <Badge variant={item.priority} size="xs">
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Min: <b className="text-slate-200">{item.minProficiency}%</b></span>
                    <span>Weight: <b className="text-indigo-400">{item.priority === 'high' ? '3.0x' : item.priority === 'medium' ? '2.0x' : '1.0x'}</b></span>
                  </div>
                </div>

                {/* Priority switcher dropdown */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={item.priority}
                    onChange={(e) => handleUpdatePriority(idx, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Remove Skill"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

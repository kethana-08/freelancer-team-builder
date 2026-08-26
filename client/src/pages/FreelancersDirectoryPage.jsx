import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Star,
  DollarSign,
  Clock,
  ExternalLink,
  Github,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export const FreelancersDirectoryPage = () => {
  const toast = useToast();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [availability, setAvailability] = useState('');

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedSkill) params.skill = selectedSkill;
      if (availability) params.availability = availability;

      const res = await authService.getFreelancers(params);
      setFreelancers(res.data.freelancers || []);
    } catch (err) {
      toast.error('Failed to load freelancers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [selectedSkill, availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          Verified Freelancer Talent Pool ({freelancers.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore specialized engineers, designers, and cloud architects available for automated squad assembly.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, skill, specialization (e.g. React, Python, UI/UX)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-none"
          >
            <option value="">All Skills</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Docker">Docker & DevOps</option>
            <option value="Flutter">Flutter</option>
            <option value="MongoDB">MongoDB</option>
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-none"
          >
            <option value="">All Availabilities</option>
            <option value="available">Available Immediately</option>
            <option value="partially_available">Partially Available</option>
            <option value="busy">Busy</option>
          </select>

          <Button variant="primary" size="sm" onClick={fetchFreelancers}>
            Filter
          </Button>
        </div>
      </div>

      {/* Talent Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading talent...
        </div>
      ) : freelancers.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
          No freelancers matched your filter criteria. Try clearing search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {freelancers.map((f) => (
            <Card key={f._id} className="flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-lg group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={f.avatar} name={f.name} size="lg" status="online" />
                    <div>
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {f.name}
                      </h3>
                      <div className="text-xs font-semibold text-indigo-400 mt-0.5">
                        {f.title || 'Engineering Specialist'}
                      </div>
                    </div>
                  </div>

                  <Badge variant="emerald" size="xs">
                    {f.availability?.status === 'available' ? 'Available' : 'Busy'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {f.bio || 'Experienced engineering specialist ready to synchronize on high-impact projects.'}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs mb-4 text-center">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Rate</span>
                    <span className="font-bold text-emerald-400">${f.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Rating</span>
                    <span className="font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {f.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Exp</span>
                    <span className="font-bold text-slate-200">{f.experienceYears}y</span>
                  </div>
                </div>

                {/* Skills Chips with Proficiency */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(f.skills || []).slice(0, 5).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-md flex items-center gap-1"
                      >
                        <span>{s.skill}</span>
                        <b className="text-indigo-400 font-mono">{s.proficiency}%</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {f.githubUrl && (
                    <a
                      href={f.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <span className="text-[11px] text-slate-500">{f.location || 'Remote'}</span>
                </div>

                <Badge variant="primary" size="xs">
                  {f.completedProjects || 8} completed projects
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

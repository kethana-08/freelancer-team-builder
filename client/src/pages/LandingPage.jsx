import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Layers,
  Star,
  DollarSign,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { RadarSkillChart } from '../components/matching/RadarSkillChart';
import { useAuth } from '../context/AuthContext';

const DEMO_PRESETS = [
  {
    title: 'Food Delivery Platform',
    category: 'Fullstack Web & Mobile',
    budget: '$12,000',
    time: '6 Weeks',
    score: 94,
    skills: [
      { skill: 'React', priority: 'high', requiredMin: 85, coveredProficiency: 96, coveredByName: 'Alex Rivera' },
      { skill: 'Node.js', priority: 'high', requiredMin: 85, coveredProficiency: 95, coveredByName: 'Marcus Vance' },
      { skill: 'UI/UX Design', priority: 'high', requiredMin: 80, coveredProficiency: 98, coveredByName: 'Sarah Chen' },
      { skill: 'MongoDB', priority: 'medium', requiredMin: 75, coveredProficiency: 92, coveredByName: 'Marcus Vance' },
      { skill: 'Docker', priority: 'medium', requiredMin: 70, coveredProficiency: 94, coveredByName: 'Marcus Vance' },
      { skill: 'Tailwind CSS', priority: 'low', requiredMin: 70, coveredProficiency: 92, coveredByName: 'Alex Rivera' }
    ],
    members: [
      { name: 'Alex Rivera', role: 'Fullstack Lead (React & TS)', rate: '$65/hr', rating: 4.95, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
      { name: 'Sarah Chen', role: 'UI/UX & Figma Specialist', rate: '$55/hr', rating: 5.0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
      { name: 'Marcus Vance', role: 'Backend & Cloud DevOps', rate: '$70/hr', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    pros: [
      '✓ 100% of required skills covered with top proficiency',
      '✓ All 3 members available immediately',
      '✓ Combined rate ($190/hr) is within target budget'
    ]
  },
  {
    title: 'AI Medical Note Assistant',
    category: 'AI & Data Science',
    budget: '$18,000',
    time: '8 Weeks',
    score: 96,
    skills: [
      { skill: 'Python', priority: 'high', requiredMin: 85, coveredProficiency: 97, coveredByName: 'David Kim' },
      { skill: 'LangChain & OpenAI', priority: 'high', requiredMin: 90, coveredProficiency: 95, coveredByName: 'David Kim' },
      { skill: 'React', priority: 'medium', requiredMin: 75, coveredProficiency: 97, coveredByName: 'Elena Rostova' },
      { skill: 'PostgreSQL', priority: 'medium', requiredMin: 70, coveredProficiency: 94, coveredByName: 'Marcus Vance' },
      { skill: 'UI/UX Design', priority: 'low', requiredMin: 65, coveredProficiency: 98, coveredByName: 'Sarah Chen' }
    ],
    members: [
      { name: 'David Kim', role: 'AI & LLM Specialist', rate: '$75/hr', rating: 4.92, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
      { name: 'Elena Rostova', role: 'Frontend & Next.js Lead', rate: '$48/hr', rating: 4.85, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Marcus Vance', role: 'Backend & Data Architect', rate: '$70/hr', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    pros: [
      '✓ Top AI proficiency with LangChain & PyTorch track record',
      '✓ Clean separation of AI pipeline and responsive frontend',
      '✓ Verified experience in health data compliance'
    ]
  }
];

export const LandingPage = () => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const currentDemo = DEMO_PRESETS[selectedDemoIndex];

  const handleQuickClientDemo = async () => {
    await demoLogin('client@teambuilder.io');
    navigate('/client/dashboard');
  };

  const handleQuickFreelancerDemo = async () => {
    await demoLogin('alex@teambuilder.io');
    navigate('/freelancer/dashboard');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-fuchsia-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Introducing Priority-Weighted Team Assembly Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-[1.15]">
            Assemble the <span className="gradient-text">Perfect Freelance Squad</span> in Seconds.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop sifting through hundreds of disconnected profiles. Define your project requirements, set skill priorities, and let our multi-attribute optimization engine assemble an elite, synchronized team ready to execute.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleQuickClientDemo}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Try Client Match Demo
            </button>

            <button
              onClick={handleQuickFreelancerDemo}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Try Freelancer Workspace
            </button>

            <Link
              to="/freelancers"
              className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              Explore Talent Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Platform Metrics */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">96.4%</div>
              <div className="text-xs text-slate-400 mt-1">Average Match Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">3.2x</div>
              <div className="text-xs text-slate-400 mt-1">Faster Kickoff Velocity</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">Skill Coverage Guarantee</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Escrow</div>
              <div className="text-xs text-slate-400 mt-1">Milestone Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Matching Simulator */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="primary" size="sm" icon={Cpu}>Live Engine Showcase</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Watch Multi-Skill Team Optimization in Action
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            See how the engine weighs priorities (High = 3.0x, Med = 2.0x, Low = 1.0x) and calculates team synergy.
          </p>
        </div>

        {/* Demo Switcher Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          {DEMO_PRESETS.map((demo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDemoIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDemoIndex === idx
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {demo.title}
            </button>
          ))}
        </div>

        {/* Simulator Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 6 cols: Radar Chart & Metrics */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentDemo.title}</h3>
                  <div className="text-xs text-slate-400">{currentDemo.category} • Budget: {currentDemo.budget} • Timeline: {currentDemo.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">{currentDemo.score}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Compatibility</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <RadarSkillChart skillCoverage={currentDemo.skills} />
              </div>

              <div className="space-y-1.5 pt-2">
                {currentDemo.pros.map((p, i) => (
                  <div key={i} className="text-xs text-emerald-400 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 6 cols: Squad Members */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                AI Assembled Squad ({currentDemo.members.length} Specialists)
              </div>

              {currentDemo.members.map((mem, i) => (
                <div
                  key={i}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={mem.avatar} name={mem.name} size="md" status="online" />
                    <div>
                      <div className="font-bold text-sm text-slate-100">{mem.name}</div>
                      <div className="text-xs text-indigo-400 font-medium">{mem.role}</div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold text-emerald-400">{mem.rate}</div>
                    <div className="text-amber-400 font-semibold">{mem.rating} ★</div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleQuickClientDemo}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Launch Workspace with This Team <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="primary" size="sm">End-to-End Platform</Badge>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Everything You Need from Match to Delivery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Intelligent Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-criteria optimization evaluating skill priority weights, rating multipliers, and availability synergy.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Project Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated workspace generation with interactive Kanban tasks, checklists, file repositories, and settings.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-950 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Real-Time Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant Socket.IO team channels with typing indicators, presence tracking, and deliverable previews.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Milestone Escrow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phase-based deliverable handoffs with client approval triggers and transparent budget tracking.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

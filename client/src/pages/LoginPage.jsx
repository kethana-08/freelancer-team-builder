import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, Sparkles, Lock, Mail, ArrowRight, UserCheck, Shield, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}!`);
      redirectUser(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (roleOrEmail, label) => {
    try {
      setDemoLoading(label);
      const user = await demoLogin(roleOrEmail);
      toast.success(`Logged in as demo ${label}!`);
      redirectUser(user.role);
    } catch (err) {
      toast.error('Failed to log in with demo credentials.');
    } finally {
      setDemoLoading(null);
    }
  };

  const redirectUser = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'freelancer') navigate('/freelancer/dashboard');
    else navigate('/client/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-glow">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to TeamBuilder</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your collaborative workspace and team matching hub
          </p>
        </div>

        {/* 1-Click Demo Accounts Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              1-Click Demo Logins
            </span>
            <span className="text-[10px] text-slate-500">Instant Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('client@teambuilder.io', 'Client (Mark)')}
              disabled={!!demoLoading}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-left transition-all text-xs"
            >
              <div className="font-bold text-slate-200">Mark Sterling</div>
              <div className="text-[10px] text-indigo-400">Client / Founder</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('alex@teambuilder.io', 'Alex (Fullstack)')}
              disabled={!!demoLoading}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all text-xs"
            >
              <div className="font-bold text-slate-200">Alex Rivera</div>
              <div className="text-[10px] text-emerald-400">Fullstack Specialist</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('sarah@teambuilder.io', 'Sarah (UI/UX)')}
              disabled={!!demoLoading}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all text-xs"
            >
              <div className="font-bold text-slate-200">Sarah Chen</div>
              <div className="text-[10px] text-purple-400">UI/UX & Design</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin@teambuilder.io', 'Admin')}
              disabled={!!demoLoading}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left transition-all text-xs"
            >
              <div className="font-bold text-slate-200">Platform Admin</div>
              <div className="text-[10px] text-amber-400">Admin Control</div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

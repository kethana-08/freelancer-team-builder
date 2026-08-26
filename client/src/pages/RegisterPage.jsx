import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Layers, Mail, Lock, User, Briefcase, DollarSign, Building } from 'lucide-react';
import { Button } from '../components/common/Button';

export const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    company: '',
    hourlyRate: 50,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        ...formData,
        role,
        hourlyRate: role === 'freelancer' ? Number(formData.hourlyRate) : undefined,
      });
      toast.success(`Account created! Welcome, ${user.name}!`);
      if (user.role === 'client') navigate('/client/dashboard');
      else navigate('/freelancer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-glow">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Join the smart freelance team assembly platform
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'client'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I'm a Client (Hire Teams)
          </button>
          <button
            type="button"
            onClick={() => setRole('freelancer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'freelancer'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I'm a Freelancer (Join Squads)
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {role === 'client' ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Acme Innovations"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    placeholder="Fullstack Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Briefcase,
  PlusCircle,
  Shield,
  Bell,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const { user, isAuthenticated, isClient, isFreelancer, isAdmin, logout, demoLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleDemoSwitch = async (roleOrEmail, label) => {
    try {
      await demoLogin(roleOrEmail);
      toast.success(`Switched active demo account to ${label}!`);
      setDemoDropdownOpen(false);
      navigate(
        roleOrEmail === 'admin'
          ? '/admin'
          : roleOrEmail.includes('alex') || roleOrEmail.includes('sarah') || roleOrEmail === 'freelancer'
          ? '/freelancer/dashboard'
          : '/client/dashboard'
      );
    } catch (err) {
      toast.error('Failed to switch demo account.');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  TeamBuilder
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/40 text-indigo-400">
                    AI Match
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {isClient && (
                  <>
                    <Link
                      to="/client/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActivePath('/client/dashboard')
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/projects/create"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActivePath('/projects/create')
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4 text-indigo-400" />
                      Build Team
                    </Link>
                    <Link
                      to="/freelancers"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActivePath('/freelancers')
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Freelancers Directory
                    </Link>
                  </>
                )}

                {isFreelancer && (
                  <>
                    <Link
                      to="/freelancer/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActivePath('/freelancer/dashboard')
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Workspace Hub
                    </Link>
                    <Link
                      to="/freelancer/profile"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActivePath('/freelancer/profile')
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      My Profile & Skills
                    </Link>
                    <Link
                      to="/freelancers"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActivePath('/freelancers')
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      Talent Directory
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActivePath('/admin')
                        ? 'bg-slate-800 text-indigo-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    Admin Portal
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {/* Demo Account Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">1-Click Demo:</span>
                <span className="text-indigo-300 font-bold capitalize">{user?.role || 'Switch'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Test Persona
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleDemoSwitch('client@teambuilder.io', 'Client (Mark Sterling)')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">Mark Sterling</div>
                        <div className="text-[10px] text-indigo-400">Client / Founder</div>
                      </div>
                      <Badge variant="primary" size="xs">Client</Badge>
                    </button>

                    <button
                      onClick={() => handleDemoSwitch('alex@teambuilder.io', 'Alex Rivera (Fullstack)')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">Alex Rivera</div>
                        <div className="text-[10px] text-emerald-400">Fullstack Specialist (96%)</div>
                      </div>
                      <Badge variant="emerald" size="xs">Freelancer</Badge>
                    </button>

                    <button
                      onClick={() => handleDemoSwitch('sarah@teambuilder.io', 'Sarah Chen (UI/UX)')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">Sarah Chen</div>
                        <div className="text-[10px] text-fuchsia-400">UI/UX & Figma (98%)</div>
                      </div>
                      <Badge variant="purple" size="xs">Freelancer</Badge>
                    </button>

                    <button
                      onClick={() => handleDemoSwitch('admin@teambuilder.io', 'Admin (Platform Overseer)')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">Platform Admin</div>
                        <div className="text-[10px] text-amber-400">Taxonomy & Users</div>
                      </div>
                      <Badge variant="amber" size="xs">Admin</Badge>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{user?.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{user?.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-3 border-b border-slate-800">
                      <div className="font-bold text-sm text-slate-100">{user?.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {isFreelancer && (
                        <Link
                          to="/freelancer/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-indigo-400" />
                          Profile & Skills
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          Admin Console
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Non-authenticated Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-slate-950 border-b border-slate-800 space-y-1.5">
          {isAuthenticated ? (
            <>
              {isClient && (
                <>
                  <Link
                    to="/client/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/projects/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
                  >
                    Build New Team
                  </Link>
                </>
              )}
              {isFreelancer && (
                <>
                  <Link
                    to="/freelancer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
                  >
                    Workspace Hub
                  </Link>
                  <Link
                    to="/freelancer/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
                  >
                    Profile & Skills
                  </Link>
                </>
              )}
              <Link
                to="/freelancers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
              >
                Freelancer Directory
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-center text-sm font-semibold text-slate-300 bg-slate-900 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

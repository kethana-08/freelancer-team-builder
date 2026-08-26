import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { TeamMatchResultPage } from './pages/TeamMatchResultPage';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { FreelancersDirectoryPage } from './pages/FreelancersDirectoryPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/freelancers" element={<FreelancersDirectoryPage />} />

          {/* Client & Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/projects/create" element={<CreateProjectPage />} />
            <Route path="/projects/:id/matches" element={<TeamMatchResultPage />} />
          </Route>

          {/* Freelancer & Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['freelancer', 'admin']} />}>
            <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
            <Route path="/freelancer/profile" element={<FreelancerProfilePage />} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route element={<ProtectedRoute allowedRoles={['client', 'freelancer', 'admin']} />}>
            <Route path="/workspace/:id" element={<ProjectWorkspacePage />} />
          </Route>

          {/* Admin Exclusive Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

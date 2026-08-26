import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  CheckSquare,
  Users,
  MessageSquare,
  File,
  TrendingUp,
  Clock,
  Settings,
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { OverviewTab } from '../components/workspace/OverviewTab';
import { TasksTab } from '../components/workspace/TasksTab';
import { TeamTab } from '../components/workspace/TeamTab';
import { ChatTab } from '../components/workspace/ChatTab';
import { FilesTab } from '../components/workspace/FilesTab';
import { MilestonesTab } from '../components/workspace/MilestonesTab';
import { ActivityTab } from '../components/workspace/ActivityTab';
import { SettingsTab } from '../components/workspace/SettingsTab';
import { projectService } from '../services/projectService';
import { workspaceService } from '../services/workspaceService';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'tasks', label: 'Tasks (Kanban)', icon: CheckSquare },
  { id: 'team', label: 'Team Squad', icon: Users },
  { id: 'chat', label: 'Live Chat', icon: MessageSquare },
  { id: 'files', label: 'Files & Assets', icon: File },
  { id: 'milestones', label: 'Milestones & Escrow', icon: TrendingUp },
  { id: 'activity', label: 'Activity Feed', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ProjectWorkspacePage = () => {
  const { id } = useParams();
  const toast = useToast();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all workspace data
  const fetchWorkspaceData = async () => {
    try {
      const [projRes, taskRes, msgRes, msRes, fileRes, actRes] = await Promise.all([
        projectService.getProjectById(id),
        workspaceService.getTasks(id),
        workspaceService.getMessages(id),
        workspaceService.getMilestones(id),
        workspaceService.getFiles(id),
        workspaceService.getActivities(id),
      ]);

      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks || []);
      setMessages(msgRes.data.messages || []);
      setMilestones(msRes.data.milestones || []);
      setFiles(fileRes.data.files || []);
      setActivities(actRes.data.activities || []);
    } catch (err) {
      toast.error('Failed to load project workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  // Real-time socket message handler
  const handleNewMessage = (newMsg) => {
    setMessages(prev => [...prev, newMsg]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <div className="text-sm text-slate-400 font-medium">Initializing Project Workspace...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
        <Link to="/client/dashboard" className="text-indigo-400 hover:underline text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to={project.client?._id === project.client ? '/client/dashboard' : '/freelancer/dashboard'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-400">Workspace:</span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white truncate max-w-lg">
                {project.title}
              </h1>
              <Badge variant={project.status === 'active' ? 'emerald' : 'primary'} size="xs">
                {project.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3">
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.teamMembers?.length || 0} active members</span>
              <span>•</span>
              <span>Budget: ${project.budget?.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          {project.recommendations && project.recommendations.length > 0 && (
            <Link to={`/projects/${project._id}/matches`}>
              <Button variant="secondary" size="sm" icon={Sparkles}>
                Matching Presets
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 8-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span>{tab.label}</span>
              {tab.id === 'tasks' && tasks.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-white font-mono">
                  {tasks.length}
                </span>
              )}
              {tab.id === 'chat' && messages.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-white font-mono">
                  {messages.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            tasks={tasks}
            milestones={milestones}
            activities={activities}
            onTabChange={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksTab
            project={project}
            tasks={tasks}
            onTaskUpdate={fetchWorkspaceData}
          />
        )}

        {activeTab === 'team' && (
          <TeamTab
            project={project}
            onProjectUpdate={fetchWorkspaceData}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab
            project={project}
            messages={messages}
            onNewMessage={handleNewMessage}
          />
        )}

        {activeTab === 'files' && (
          <FilesTab
            project={project}
            files={files}
            onFileUpdate={fetchWorkspaceData}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesTab
            project={project}
            milestones={milestones}
            onMilestoneUpdate={fetchWorkspaceData}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityTab
            activities={activities}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            project={project}
            onProjectUpdate={fetchWorkspaceData}
          />
        )}
      </div>
    </div>
  );
};

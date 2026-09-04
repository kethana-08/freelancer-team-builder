import React, { useState, useEffect, useRef } from 'react';
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
  const { socket, isConnected, joinProject, leaveProject } = useSocket();

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const wasConnectedRef = useRef(false);

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

  useEffect(() => {
    if (!isConnected) return;
    if (wasConnectedRef.current) fetchWorkspaceData();
    wasConnectedRef.current = true;
  }, [isConnected, id]);

  useEffect(() => {
    if (!id) return;
    joinProject(id);
    return () => leaveProject(id);
  }, [id, joinProject, leaveProject]);

  useEffect(() => {
    if (!socket || !id) return;

    const matchesWorkspace = (projectId) => projectId?.toString() === id.toString();
    const addUnique = (items, item) => (
      items.some(existing => existing._id?.toString() === item?._id?.toString())
        ? items
        : [...items, item]
    );
    const replaceById = (items, item) => items.map(existing => (
      existing._id?.toString() === item?._id?.toString() ? item : existing
    ));

    const handleProjectUpdated = ({ project: updatedProject, projectId }) => {
      if (!matchesWorkspace(projectId) && updatedProject?._id?.toString() !== id.toString()) return;
      setProject(updatedProject);
    };
    const handleTaskCreated = ({ projectId, task }) => {
      if (matchesWorkspace(projectId) && task) setTasks(prev => addUnique(prev, task));
    };
    const handleTaskUpdated = ({ projectId, task }) => {
      if (matchesWorkspace(projectId) && task) setTasks(prev => replaceById(prev, task));
    };
    const handleTaskDeleted = ({ projectId, taskId }) => {
      if (matchesWorkspace(projectId)) setTasks(prev => prev.filter(task => task._id?.toString() !== taskId?.toString()));
    };
    const handleMessageSent = ({ projectId, message }) => {
      if (matchesWorkspace(projectId) && message) setMessages(prev => addUnique(prev, message));
    };
    const handleMilestoneCreated = ({ projectId, milestone }) => {
      if (matchesWorkspace(projectId) && milestone) setMilestones(prev => addUnique(prev, milestone));
    };
    const handleMilestoneUpdated = ({ projectId, milestone }) => {
      if (matchesWorkspace(projectId) && milestone) setMilestones(prev => replaceById(prev, milestone));
    };
    const handleFileUploaded = ({ projectId, file }) => {
      if (matchesWorkspace(projectId) && file) setFiles(prev => addUnique(prev, file));
    };
    const handleFileDeleted = ({ projectId, fileId }) => {
      if (matchesWorkspace(projectId)) setFiles(prev => prev.filter(file => file._id?.toString() !== fileId?.toString()));
    };
    const handleActivityCreated = ({ projectId, activity }) => {
      if (matchesWorkspace(projectId) && activity) {
        setActivities(prev => [...addUnique(prev, activity)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    };

    socket.on('workspace:project_updated', handleProjectUpdated);
    socket.on('workspace:task_created', handleTaskCreated);
    socket.on('workspace:task_updated', handleTaskUpdated);
    socket.on('workspace:task_deleted', handleTaskDeleted);
    socket.on('workspace:task_status_changed', handleTaskUpdated);
    socket.on('workspace:message_sent', handleMessageSent);
    socket.on('workspace:milestone_created', handleMilestoneCreated);
    socket.on('workspace:milestone_updated', handleMilestoneUpdated);
    socket.on('workspace:milestone_status_changed', handleMilestoneUpdated);
    socket.on('workspace:file_uploaded', handleFileUploaded);
    socket.on('workspace:file_deleted', handleFileDeleted);
    socket.on('workspace:activity_created', handleActivityCreated);

    return () => {
      socket.off('workspace:project_updated', handleProjectUpdated);
      socket.off('workspace:task_created', handleTaskCreated);
      socket.off('workspace:task_updated', handleTaskUpdated);
      socket.off('workspace:task_deleted', handleTaskDeleted);
      socket.off('workspace:task_status_changed', handleTaskUpdated);
      socket.off('workspace:message_sent', handleMessageSent);
      socket.off('workspace:milestone_created', handleMilestoneCreated);
      socket.off('workspace:milestone_updated', handleMilestoneUpdated);
      socket.off('workspace:milestone_status_changed', handleMilestoneUpdated);
      socket.off('workspace:file_uploaded', handleFileUploaded);
      socket.off('workspace:file_deleted', handleFileDeleted);
      socket.off('workspace:activity_created', handleActivityCreated);
    };
  }, [socket, id]);

  // Real-time socket message handler
  const handleNewMessage = (newMsg) => {
    setMessages(prev => prev.some(message => message._id?.toString() === newMsg?._id?.toString()) ? prev : [...prev, newMsg]);
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
        <div className="workspace-header-main flex items-center gap-3">
          <Link
            to={project.client?._id === project.client ? '/client/dashboard' : '/freelancer/dashboard'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="workspace-header-details">
            <div className="workspace-title-row flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-400">Workspace:</span>
              <h1 className="workspace-title text-lg sm:text-xl font-extrabold text-white truncate max-w-lg">
                {project.title}
              </h1>
              <Badge variant={project.status === 'active' ? 'emerald' : 'primary'} size="xs">
                {project.status.toUpperCase()}
              </Badge>
            </div>
            <div className="workspace-meta text-xs text-slate-500 flex items-center gap-3">
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.teamMembers?.length || 0} active members</span>
              <span>•</span>
              <span>Budget: ${project.budget?.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="workspace-quick-links flex items-center gap-2">
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
      <div className="workspace-tabs flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`workspace-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

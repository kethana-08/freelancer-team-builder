import React, { useState } from 'react';
import {
  Plus,
  CheckSquare,
  Clock,
  User,
  MoreVertical,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Tag,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { workspaceService } from '../../services/workspaceService';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'border-slate-700 bg-slate-900/40' },
  { id: 'todo', title: 'To Do', color: 'border-indigo-500/30 bg-indigo-950/20' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500/30 bg-amber-950/20' },
  { id: 'in_review', title: 'In Review', color: 'border-purple-500/30 bg-purple-950/20' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500/30 bg-emerald-950/20' },
];

export const TasksTab = ({ project, tasks = [], onTaskUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    estimatedHours: 4,
    dueDate: '',
  });

  // Comment input state
  const [newComment, setNewComment] = useState('');

  const teamMembers = project?.teamMembers || [];

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    try {
      const res = await workspaceService.createTask(project._id, {
        ...newTask,
        assignedTo: newTask.assignedTo || undefined
      });
      toast.success('Task created!');
      setCreateModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        estimatedHours: 4,
        dueDate: '',
      });
      onTaskUpdate();
    } catch (err) {
      toast.error('Failed to create task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await workspaceService.updateTask(taskId, { status: newStatus });
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
      onTaskUpdate();
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await workspaceService.deleteTask(taskId);
      toast.info('Task removed.');
      setIsDetailModalOpen(false);
      onTaskUpdate();
    } catch (err) {
      toast.error('Failed to delete task.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const res = await workspaceService.addTaskComment(selectedTask._id, newComment);
      toast.success('Comment added');
      setSelectedTask(res.data.task);
      setNewComment('');
      onTaskUpdate();
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleToggleSubtask = async (subtaskIndex) => {
    if (!selectedTask) return;
    const updatedSubtasks = [...(selectedTask.subtasks || [])];
    updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;

    try {
      const res = await workspaceService.updateTask(selectedTask._id, {
        subtasks: updatedSubtasks
      });
      setSelectedTask(res.data.task);
      onTaskUpdate();
    } catch (err) {
      toast.error('Failed to update checklist');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterAssignee !== 'all') {
      if (filterAssignee === 'unassigned' && task.assignedTo) return false;
      if (filterAssignee !== 'unassigned' && task.assignedTo?._id !== filterAssignee) return false;
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {teamMembers.map((m, idx) => (
              <option key={idx} value={m.user?._id}>
                {m.user?.name}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Task
        </Button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} p-3.5 flex flex-col min-h-[500px] backdrop-blur-md`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-200">{col.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3">
                {colTasks.map((task) => {
                  const subtasksTotal = task.subtasks?.length || 0;
                  const subtasksDone = task.subtasks?.filter(s => s.completed)?.length || 0;

                  return (
                    <div
                      key={task._id}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDetailModalOpen(true);
                      }}
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 p-3.5 rounded-xl cursor-pointer shadow-md hover:shadow-glow transition-all group"
                    >
                      {/* Priority and Actions */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={task.priority} size="xs">
                          {task.priority.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {task.estimatedHours}h
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                        {task.title}
                      </h4>

                      {/* Subtasks / Checklist progress */}
                      {subtasksTotal > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2.5">
                          <CheckSquare className="w-3 h-3 text-indigo-400" />
                          <span>{subtasksDone}/{subtasksTotal} subtasks</span>
                        </div>
                      )}

                      {/* Card Footer: Assignee + Comment count */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                        <div className="flex items-center gap-1.5">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar src={task.assignedTo?.avatar} name={task.assignedTo?.name} size="xs" />
                              <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
                                {task.assignedTo?.name?.split(' ')[0]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Unassigned</span>
                          )}
                        </div>

                        {task.comments?.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            <span>{task.comments.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-24 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-[11px] text-slate-600">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project Task"
        subtitle="Assign tasks to squad members with priorities and estimates."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Payment Gateway Integration"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description / Requirements
            </label>
            <textarea
              rows="3"
              placeholder="Detailed acceptance criteria or implementation notes..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent 🔥</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Assign To Team Member
              </label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Unassigned --</option>
                {teamMembers.map((m, idx) => (
                  <option key={idx} value={m.user?._id}>
                    {m.user?.name} ({m.roleInProject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Estimated Hours
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Details / Edit / Comments Modal */}
      {selectedTask && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedTask.title}
          subtitle={`Task in ${selectedTask.status.replace('_', ' ').toUpperCase()}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => handleDeleteTask(selectedTask._id)}
              >
                Delete Task
              </Button>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Status Quick Switch Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Current Status:</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => handleStatusChange(selectedTask._id, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-indigo-400 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={selectedTask.priority} size="xs">
                  {selectedTask.priority?.toUpperCase()} PRIORITY
                </Badge>
                <span className="text-xs text-slate-400">
                  Est: <b className="text-slate-200">{selectedTask.estimatedHours || 4} hrs</b>
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {selectedTask.description || 'No description provided for this task.'}
              </p>
            </div>

            {/* Assignee Information */}
            <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Assigned to:</span>
              {selectedTask.assignedTo ? (
                <div className="flex items-center gap-2">
                  <Avatar src={selectedTask.assignedTo.avatar} name={selectedTask.assignedTo.name} size="xs" />
                  <span className="text-xs font-semibold text-slate-200">{selectedTask.assignedTo.name}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Unassigned</span>
              )}
            </div>

            {/* Subtasks Checklist */}
            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Checklist ({selectedTask.subtasks.filter(s => s.completed).length}/{selectedTask.subtasks.length})
                </h5>
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedTask.subtasks.map((st, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-1"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(i)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                      />
                      <span className={st.completed ? 'line-through text-slate-500' : ''}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Thread */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Comments & Updates ({selectedTask.comments?.length || 0})
              </h5>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-3">
                {(selectedTask.comments || []).map((comm, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <Avatar src={comm.user?.avatar} name={comm.user?.name} size="xs" />
                        <span>{comm.user?.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 pl-6">{comm.text}</p>
                  </div>
                ))}

                {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                  <div className="text-xs text-slate-500 text-center py-2">No comments yet.</div>
                )}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" variant="primary" size="sm">
                  Send
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

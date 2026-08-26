import React from 'react';
import { Clock, Activity, CheckCircle2, UserPlus, Upload, ShieldCheck, Tag } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const ActivityTab = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'member_joined':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'milestone_approved':
      case 'milestone_paid':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'task_status_changed':
        return <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
      case 'file_uploaded':
        return <Upload className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Project Audit & Activity Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete chronological event timeline of all collaboration events.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((act, idx) => (
          <div key={idx} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
              {getActionIcon(act.action)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-200 leading-relaxed">
                {act.details}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span>{act.user?.name || 'System'}</span>
                <span>•</span>
                <span>{new Date(act.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No activity records found.
          </div>
        )}
      </div>
    </div>
  );
};

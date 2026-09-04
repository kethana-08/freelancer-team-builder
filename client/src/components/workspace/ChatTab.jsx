import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Sparkles, Check, CheckCheck, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { workspaceService } from '../../services/workspaceService';
import { useToast } from '../../context/ToastContext';

export const ChatTab = ({ project, messages = [], onNewMessage }) => {
  const { user } = useAuth();
  const { socket, startTyping, stopTyping } = useSocket();
  const toast = useToast();

  const [inputMessage, setInputMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = ({ projectId, userId, userName, isTyping }) => {
      if (projectId === project?._id && userId !== user?._id) {
        setTypingUsers(prev => {
          const next = new Set(prev);
          if (isTyping) next.add(userName);
          else next.delete(userName);
          return next;
        });
      }
    };

    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, project?._id, user?._id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (project?._id) {
      startTyping(project._id, user?.name);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(project._id);
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    try {
      setSending(true);
      const text = inputMessage.trim();
      setInputMessage('');
      stopTyping(project._id);

      const res = await workspaceService.sendMessage(project._id, { text });
      onNewMessage(res.data.message);
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] max-h-[calc(100dvh-9rem)] min-h-[420px] overflow-hidden shadow-xl min-w-0">
      {/* Chat Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm text-slate-100">{project?.title} — Live Team Channel</h3>
            <div className="text-[11px] text-slate-400">
              {project?.teamMembers?.length || 0} squad members in channel
            </div>
          </div>
        </div>

        <Badge variant="primary" size="xs">
          Socket.IO Encrypted
        </Badge>
      </div>

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user?._id;
          const isSystem = msg.isSystemMessage;

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center my-3">
                <div className="bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <Avatar
                  src={msg.sender?.avatar}
                  name={msg.sender?.name}
                  size="sm"
                  status="online"
                />
              )}

              <div
                className={`max-w-[min(32rem,calc(100vw-5rem))] rounded-2xl p-3.5 shadow-md ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Sender Info (for other users) */}
                {!isMe && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400">{msg.sender?.name}</span>
                    <span className="text-[10px] text-slate-500">{msg.sender?.title}</span>
                  </div>
                )}

                {/* Message Text */}
                <p className="text-xs leading-relaxed break-words">{msg.text}</p>

                {/* Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-black/20 text-xs hover:bg-black/30 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{att.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isMe ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isMe && (
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="sm"
                  status="online"
                />
              )}
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
            <span>Welcome to the workspace team channel! Send a message to get started.</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator Bar */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-1.5 bg-slate-950 text-[11px] text-indigo-400 italic flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          <span>{Array.from(typingUsers).join(', ')} is typing...</span>
        </div>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 min-w-0">
        <input
          type="text"
          placeholder="Type your message, ask a question, or share an update..."
          value={inputMessage}
          onChange={handleInputChange}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputMessage.trim() || sending}
          icon={Send}
          className="shrink-0"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

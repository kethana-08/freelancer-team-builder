import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';

export const setupSocketIO = (io) => {
  // Track online users
  const onlineUsers = new Map(); // userId -> socketId

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (token) {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).select('name role avatar');
        if (user) {
          socket.user = user;
          return next();
        }
      }
      // Allow guest/unauth connections for public demo rooms if needed, but attach flag
      socket.user = { _id: 'guest', name: 'Anonymous' };
      next();
    } catch (err) {
      // Don't reject outright so UI doesn't crash on reconnect before token loads
      socket.user = { _id: 'guest', name: 'Guest' };
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();
    if (userId && userId !== 'guest') {
      onlineUsers.set(userId, socket.id);
      socket.join(`user_${userId}`);
      io.emit('user_online_status', { userId, status: 'online' });
    }

    // Join Project Workspace Room
    socket.on('join_project', async ({ projectId } = {}) => {
      try {
        if (!projectId || userId === 'guest') return;

        const project = await Project.findById(projectId).select('client teamMembers.user');
        const isMember = project && (
          socket.user.role === 'admin' ||
          project.client.toString() === userId ||
          project.teamMembers.some(member => member.user.toString() === userId)
        );

        if (isMember) {
          socket.join(`project_${projectId}`);
        }
      } catch (error) {
        console.error('Project room join failed:', error.message);
      }
    });

    // Leave Project Workspace Room
    socket.on('leave_project', ({ projectId }) => {
      if (projectId) {
        socket.leave(`project_${projectId}`);
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ projectId, userName }) => {
      socket.to(`project_${projectId}`).emit('user_typing', {
        projectId,
        userId: socket.user?._id,
        userName: userName || socket.user?.name,
        isTyping: true
      });
    });

    socket.on('typing_stop', ({ projectId }) => {
      socket.to(`project_${projectId}`).emit('user_typing', {
        projectId,
        userId: socket.user?._id,
        isTyping: false
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (userId && userId !== 'guest') {
        onlineUsers.delete(userId);
        io.emit('user_online_status', { userId, status: 'offline' });
      }
    });
  });

  return {
    emitToProject: (projectId, event, data) => {
      io.to(`project_${projectId}`).emit(event, data);
    },
    emitToUser: (userId, event, data) => {
      io.to(`user_${userId}`).emit(event, data);
    },
    leaveUserFromProject: (userId, projectId) => {
      io.in(`user_${userId}`).socketsLeave(`project_${projectId}`);
    },
    getOnlineUsers: () => Array.from(onlineUsers.keys())
  };
};

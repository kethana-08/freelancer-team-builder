import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
  const socketUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000';

 const newSocket = io(socketUrl, {
  auth: { token: token || '' },
  transports: ['websocket'],
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

  newSocket.on('connect', () => {
    setIsConnected(true);
  });

  newSocket.on('disconnect', () => {
    setIsConnected(false);
  });

  newSocket.on('user_online_status', ({ userId, status }) => {
    setOnlineUsers(prev => {
      const next = new Set(prev);

      if (status === 'online') {
        next.add(userId);
      } else {
        next.delete(userId);
      }

      return next;
    });
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, [token, user?._id]);

  const joinProject = (projectId) => {
    if (socket && isConnected) {
      socket.emit('join_project', { projectId });
    }
  };

  const leaveProject = (projectId) => {
    if (socket && isConnected) {
      socket.emit('leave_project', { projectId });
    }
  };

  const startTyping = (projectId, userName) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { projectId, userName });
    }
  };

  const stopTyping = (projectId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { projectId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        joinProject,
        leaveProject,
        startTyping,
        stopTyping
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

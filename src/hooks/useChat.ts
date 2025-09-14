import { useContext } from 'react';
import { ChatContext } from '@/contexts/ChatContext';
import { ChatContextType } from '@/types/chat';

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}

export function useAuth() {
  const { state } = useChat();
  
  return {
    user: state.currentUser,
    isAuthenticated: !!state.currentUser,
  };
}

export function useCurrentRoom() {
  const { state } = useChat();
  
  const currentRoom = state.rooms.find(room => room.id === state.currentRoom);
  const messages = state.currentRoom ? state.messages[state.currentRoom] || [] : [];
  const onlineUsers = state.currentRoom ? state.onlineUsers[state.currentRoom] || [] : [];
  const typingUsers = state.currentRoom ? state.typingUsers[state.currentRoom] || [] : [];
  
  return {
    room: currentRoom,
    messages,
    onlineUsers,
    typingUsers,
    isLoading: state.isLoading,
  };
}
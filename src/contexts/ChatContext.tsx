'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatState, ChatAction, ChatContextType, Message, TypingUser } from '@/types/chat';
import { useAuth } from './AuthContext';
import { mockRooms, generateInitialMessages, botMessages } from '@/lib/mockData';
import { generateMessageId, generateBotMessage } from '@/lib/chatUtils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const initialState: ChatState = {
  currentUser: null,
  messages: {},
  rooms: mockRooms,
  currentRoom: null,
  onlineUsers: {},
  typingUsers: {},
  isLoading: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        rooms: state.rooms,
      };

    case 'SET_CURRENT_ROOM':
      return {
        ...state,
        currentRoom: action.payload,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: [
            ...(state.messages[action.payload.roomId] || []),
            action.payload,
          ],
        },
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (state.messages[action.payload.roomId] || []).filter(
            msg => msg.id !== action.payload.messageId
          ),
        },
      };

    case 'EDIT_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (state.messages[action.payload.roomId] || []).map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, content: action.payload.content, isEdited: true }
              : msg
          ),
        },
      };

    case 'ADD_REACTION':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (state.messages[action.payload.roomId] || []).map(msg =>
            msg.id === action.payload.messageId
              ? {
                  ...msg,
                  reactions: [
                    ...(msg.reactions || []).filter(
                      r => !(r.userId === action.payload.reaction.userId && r.emoji === action.payload.reaction.emoji)
                    ),
                    action.payload.reaction,
                  ],
                }
              : msg
          ),
        },
      };

    case 'REMOVE_REACTION':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (state.messages[action.payload.roomId] || []).map(msg =>
            msg.id === action.payload.messageId
              ? {
                  ...msg,
                  reactions: (msg.reactions || []).filter(
                    r => !(r.userId === action.payload.userId && r.emoji === action.payload.emoji)
                  ),
                }
              : msg
          ),
        },
      };

    case 'SET_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: {
          ...state.onlineUsers,
          [action.payload.roomId]: action.payload.users,
        },
      };

    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.roomId]: action.payload.users,
        },
      };

    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [persistedMessages, setPersistedMessages] = useLocalStorage<Record<string, Message[]>>('chat-messages', {});

  // Update current user when auth changes
  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, [user]);

  // Load persisted messages on mount
  useEffect(() => {
    Object.keys(persistedMessages).forEach(roomId => {
      dispatch({
        type: 'LOAD_MESSAGES',
        payload: { roomId, messages: persistedMessages[roomId] },
      });
    });
  }, [persistedMessages]);

  // Generate initial messages for rooms that don't have any
  useEffect(() => {
    mockRooms.forEach(room => {
      if (!state.messages[room.id] || state.messages[room.id].length === 0) {
        const initialMessages = generateInitialMessages(room.id);
        dispatch({
          type: 'LOAD_MESSAGES',
          payload: { roomId: room.id, messages: initialMessages },
        });
      }
    });
  }, [state.messages]);

  // Persist messages when they change
  useEffect(() => {
    if (Object.keys(state.messages).length > 0) {
      setPersistedMessages(state.messages);
    }
  }, [state.messages, setPersistedMessages]);

  // Simulate bot messages
  useEffect(() => {
    if (!state.currentRoom || !user) return;

    const interval = setInterval(() => {
      // Random chance to send a bot message (10% every 30 seconds)
      if (Math.random() < 0.1) {
        const botMessage = generateBotMessage(state.currentRoom!, botMessages);
        if (botMessage) {
          const message: Message = {
            ...botMessage,
            id: generateMessageId(),
            timestamp: new Date(),
          };
          
          dispatch({ type: 'ADD_MESSAGE', payload: message });
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.currentRoom, user]);

  const sendMessage = (content: string) => {
    if (!user || !state.currentRoom || !content.trim()) return;

    const message: Message = {
      id: generateMessageId(),
      content: content.trim(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userColor: user.color,
      timestamp: new Date(),
      roomId: state.currentRoom,
      reactions: [],
    };

    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const deleteMessage = (messageId: string) => {
    if (!state.currentRoom) return;
    
    dispatch({
      type: 'DELETE_MESSAGE',
      payload: { messageId, roomId: state.currentRoom },
    });
  };

  const editMessage = (messageId: string, content: string) => {
    if (!state.currentRoom) return;
    
    dispatch({
      type: 'EDIT_MESSAGE',
      payload: { messageId, roomId: state.currentRoom, content },
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!user || !state.currentRoom) return;

    const reaction = {
      emoji,
      userId: user.id,
      username: user.username,
    };

    dispatch({
      type: 'ADD_REACTION',
      payload: { messageId, roomId: state.currentRoom, reaction },
    });
  };

  const removeReaction = (messageId: string, emoji: string) => {
    if (!user || !state.currentRoom) return;

    dispatch({
      type: 'REMOVE_REACTION',
      payload: { messageId, roomId: state.currentRoom, userId: user.id, emoji },
    });
  };

  const joinRoom = (roomId: string) => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: roomId });
  };

  const setTyping = (isTyping: boolean) => {
    if (!user || !state.currentRoom) return;

    const typingUser: TypingUser = {
      userId: user.id,
      username: user.username,
      timestamp: new Date(),
    };

    const currentTypingUsers = state.typingUsers[state.currentRoom] || [];
    
    if (isTyping) {
      const updatedTypingUsers = [
        ...currentTypingUsers.filter(u => u.userId !== user.id),
        typingUser,
      ];
      
      dispatch({
        type: 'SET_TYPING_USERS',
        payload: { roomId: state.currentRoom, users: updatedTypingUsers },
      });

      // Remove typing indicator after 3 seconds
      const currentRoomId = state.currentRoom;
      setTimeout(() => {
        if (currentRoomId) {
          const stillTypingUsers = (state.typingUsers[currentRoomId] || []).filter(
            (u: TypingUser) => u.userId !== user.id
          );
          
          dispatch({
            type: 'SET_TYPING_USERS',
            payload: { roomId: currentRoomId, users: stillTypingUsers },
          });
        }
      }, 3000);
    }
  };

  const value: ChatContextType = {
    state,
    dispatch,
    sendMessage,
    deleteMessage,
    editMessage,
    addReaction,
    removeReaction,
    joinRoom,
    setTyping,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
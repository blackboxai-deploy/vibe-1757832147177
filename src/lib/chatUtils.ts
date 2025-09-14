import { Message, User } from '@/types/chat';

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
];

export const getRandomColor = (): string => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

export const formatMessageTime = (timestamp: Date): string => {
  if (isToday(timestamp)) {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday(timestamp)) {
    return `Yesterday ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return timestamp.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

export const formatLastSeen = (timestamp: Date): string => {
  if (isToday(timestamp)) {
    return `Active ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday(timestamp)) {
    return 'Active yesterday';
  } else {
    return `Active ${formatDistanceToNow(timestamp)}`;
  }
};

export const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidMessage = (content: string): boolean => {
  return content.trim().length > 0 && content.trim().length <= 2000;
};

export const sanitizeMessage = (content: string): string => {
  return content.trim().replace(/\s+/g, ' ');
};

export const extractMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

export const highlightMentions = (content: string, currentUsername?: string): string => {
  if (!currentUsername) return content;
  
  const mentionRegex = new RegExp(`@(${currentUsername})\\b`, 'gi');
  return content.replace(mentionRegex, '<span class="bg-blue-100 text-blue-800 px-1 rounded">@$1</span>');
};

export const searchMessages = (messages: Message[], query: string): Message[] => {
  if (!query.trim()) return messages;
  
  const searchTerm = query.toLowerCase();
  return messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm) ||
    message.username.toLowerCase().includes(searchTerm)
  );
};

export const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  const grouped: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    let dateKey: string;
    
    if (isToday(message.timestamp)) {
      dateKey = 'Today';
    } else if (isYesterday(message.timestamp)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = message.timestamp.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(message);
  });
  
  return grouped;
};

export const shouldShowAvatar = (messages: Message[], currentIndex: number): boolean => {
  const currentMessage = messages[currentIndex];
  const nextMessage = messages[currentIndex + 1];
  
  // Always show avatar for the last message from a user
  if (!nextMessage || nextMessage.userId !== currentMessage.userId) {
    return true;
  }
  
  // Show avatar if the next message is from a different user or more than 5 minutes apart
  const timeDiff = nextMessage.timestamp.getTime() - currentMessage.timestamp.getTime();
  return timeDiff > 5 * 60 * 1000; // 5 minutes
};

export const shouldGroupMessage = (messages: Message[], currentIndex: number): boolean => {
  if (currentIndex === 0) return false;
  
  const currentMessage = messages[currentIndex];
  const previousMessage = messages[currentIndex - 1];
  
  // Group if same user and within 5 minutes
  if (previousMessage.userId === currentMessage.userId) {
    const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
    return timeDiff < 5 * 60 * 1000; // 5 minutes
  }
  
  return false;
};

export const getOnlineStatus = (user: User): string => {
  if (user.isOnline) return 'Online';
  return formatLastSeen(user.lastSeen);
};

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const generateBotMessage = (roomId: string, botMessages: Record<string, string[]>): Omit<Message, 'id' | 'timestamp'> | null => {
  const roomMessages = botMessages[roomId];
  if (!roomMessages || roomMessages.length === 0) return null;
  
  // Import botUsers here to avoid circular dependency
  const botUsers = [
    {
      id: 'bot-alice',
      username: 'Alice',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2953e218-9503-4158-8959-47e6400180a3.png',
      color: '#FF6B6B'
    },
    {
      id: 'bot-bob',
      username: 'Bob',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ad06dcfd-1d0a-4f0f-befb-4fb8cfcfee03.png',
      color: '#4ECDC4'
    },
    {
      id: 'bot-carol',
      username: 'Carol',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8f951fa4-9b79-4987-8d4d-50abbbf7d38d.png',
      color: '#45B7D1'
    }
  ];
  
  const randomUser = botUsers[Math.floor(Math.random() * botUsers.length)];
  const randomMessage = roomMessages[Math.floor(Math.random() * roomMessages.length)];
  
  return {
    content: randomMessage,
    userId: randomUser.id,
    username: randomUser.username,
    userAvatar: randomUser.avatar,
    userColor: randomUser.color,
    roomId,
    reactions: []
  };
};
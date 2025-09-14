export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  userAvatar: string;
  userColor: string;
  timestamp: Date;
  roomId: string;
  reactions?: MessageReaction[];
  isEdited?: boolean;
  replyTo?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  lastActivity: Date;
  avatar: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

export interface ChatState {
  currentUser: User | null;
  messages: Record<string, Message[]>;
  rooms: ChatRoom[];
  currentRoom: string | null;
  onlineUsers: Record<string, User[]>;
  typingUsers: Record<string, TypingUser[]>;
  isLoading: boolean;
}

export type ChatAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_ROOM'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: { messageId: string; roomId: string } }
  | { type: 'EDIT_MESSAGE'; payload: { messageId: string; roomId: string; content: string } }
  | { type: 'ADD_REACTION'; payload: { messageId: string; roomId: string; reaction: MessageReaction } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: string; roomId: string; userId: string; emoji: string } }
  | { type: 'SET_ONLINE_USERS'; payload: { roomId: string; users: User[] } }
  | { type: 'SET_TYPING_USERS'; payload: { roomId: string; users: TypingUser[] } }
  | { type: 'LOAD_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'SET_LOADING'; payload: boolean };

export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  joinRoom: (roomId: string) => void;
  setTyping: (isTyping: boolean) => void;
}
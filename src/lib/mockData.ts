import { ChatRoom, Message, User } from '@/types/chat';

export const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
];

export const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion for everyone',
    isPrivate: false,
    memberCount: 124,
    lastActivity: new Date(),
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c082a7ae-69f3-4b72-acb9-2d6c54f69df1.png'
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Discuss the latest in technology',
    isPrivate: false,
    memberCount: 87,
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4c964092-7c2e-465f-a383-9ad96ed14dc6.png'
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Off-topic conversations and fun',
    isPrivate: false,
    memberCount: 203,
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/36dc8ecc-c00a-4332-92d3-4eaf910f6cd8.png'
  },
  {
    id: 'help',
    name: 'Help',
    description: 'Get help and support from the community',
    isPrivate: false,
    memberCount: 56,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/93394419-c0c0-4866-9f5e-e5056b4e26bd.png'
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Share and discuss design ideas',
    isPrivate: false,
    memberCount: 78,
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/98eca035-e610-48ca-bea2-17bde9a5e6a2.png'
  }
];

export const botUsers: User[] = [
  {
    id: 'bot-alice',
    username: 'Alice',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/420a434e-51c7-4a27-bf06-aef90f94febf.png',
    isOnline: true,
    lastSeen: new Date(),
    color: '#FF6B6B'
  },
  {
    id: 'bot-bob',
    username: 'Bob',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/49a9041e-2458-47ed-8944-f9f34dc23407.png',
    isOnline: true,
    lastSeen: new Date(),
    color: '#4ECDC4'
  },
  {
    id: 'bot-carol',
    username: 'Carol',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0dd983fb-6e53-479a-8b01-883f64d446a0.png',
    isOnline: true,
    lastSeen: new Date(),
    color: '#45B7D1'
  },
  {
    id: 'bot-david',
    username: 'David',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b009abc8-3c60-4a02-8ae2-f13e6901ea19.png',
    isOnline: Math.random() > 0.3,
    lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
    color: '#96CEB4'
  },
  {
    id: 'bot-emma',
    username: 'Emma',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d3bc8a12-5101-458c-8d41-b2f294d90fc9.png',
    isOnline: Math.random() > 0.3,
    lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
    color: '#FFEAA7'
  }
];

export const botMessages: Record<string, string[]> = {
  general: [
    'Hey everyone! How\'s it going? 👋',
    'Just finished a great book, any recommendations?',
    'Beautiful weather today! Anyone going outside?',
    'Coffee or tea? I\'m team coffee ☕',
    'Happy Friday! Any weekend plans?',
    'Just discovered this amazing playlist 🎵',
    'Anyone else excited for the holidays?',
    'Working from home today, loving it!',
    'Just watched an incredible movie 🍿',
    'Anyone want to grab lunch later?'
  ],
  'tech-talk': [
    'Just deployed my app with the new CI/CD pipeline! 🚀',
    'Anyone tried the latest React 19 features?',
    'TypeScript 5.3 has some amazing improvements',
    'Working on a machine learning project, it\'s fascinating!',
    'Docker containers are game-changers for development',
    'Just learned about WebAssembly, mind blown 🤯',
    'VS Code extensions that changed my workflow',
    'Database optimization tips anyone?',
    'Kubernetes is complex but so powerful',
    'Anyone using Rust? I\'m loving the performance!'
  ],
  random: [
    'Did you see that viral cat video? 😹',
    'Pizza or burgers for dinner tonight?',
    'Just learned to juggle! Only dropped it 100 times',
    'Anyone else addicted to this new game?',
    'My plant is finally growing! 🌱',
    'Rainy days are perfect for reading',
    'Just tried a new recipe, it was amazing!',
    'Anyone else procrastinating right now?',
    'Found the perfect meme for this situation',
    'Life is like a box of chocolates 🍫'
  ],
  help: [
    'Can someone help with React state management?',
    'How do I center a div? (classic question 😅)',
    'Git merge conflicts are driving me crazy!',
    'What\'s the best way to learn TypeScript?',
    'Database design best practices?',
    'How to optimize website performance?',
    'Debugging tips for complex applications?',
    'API design principles anyone?',
    'How to handle authentication securely?',
    'Best resources for learning algorithms?'
  ],
  design: [
    'Color theory is so important in design 🎨',
    'Just finished a new logo design, love it!',
    'Figma vs Adobe XD, what do you prefer?',
    'Typography can make or break a design',
    'User experience should be the priority',
    'Minimalist design is timeless',
    'Dark mode or light mode?',
    'Animation adds life to interfaces ✨',
    'Accessibility in design is crucial',
    'Just discovered this amazing design trend'
  ]
};

export const generateRandomAvatar = (): string => {
  const styles = ['avataaars', 'lorelei', 'personas'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const seed = Math.random().toString(36).substring(7);
  return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3560981d-20ac-43d2-b818-bee49275976b.png}+style+${seed}`;
};

export const getRandomColor = (): string => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

export const generateInitialMessages = (roomId: string): Message[] => {
  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 5) + 3; // 3-7 messages
  const roomMessages = botMessages[roomId] || botMessages.general;
  
  for (let i = 0; i < messageCount; i++) {
    const user = botUsers[Math.floor(Math.random() * botUsers.length)];
    const messageContent = roomMessages[Math.floor(Math.random() * roomMessages.length)];
    
    messages.push({
      id: `msg-${Date.now()}-${i}`,
      content: messageContent,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userColor: user.color,
      timestamp: new Date(Date.now() - (messageCount - i) * 60 * 1000 * Math.random() * 60),
      roomId,
      reactions: []
    });
  }
  
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
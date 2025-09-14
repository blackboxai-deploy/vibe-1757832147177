'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { LoginModal } from '@/components/LoginModal';
import { RoomList } from '@/components/RoomList';
import { ChatInterface } from '@/components/ChatInterface';
import { useCurrentRoom } from '@/hooks/useChat';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { state, joinRoom } = useChat();
  const { room } = useCurrentRoom();

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with room list */}
      <div className="w-80 border-r border-border bg-card">
        <RoomList 
          rooms={state.rooms}
          currentRoom={state.currentRoom}
          onRoomSelect={joinRoom}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {room ? (
          <ChatInterface />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Welcome to Modern Chat
              </h2>
              <p className="text-muted-foreground">
                Select a room from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
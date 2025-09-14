'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { LoginModal } from '@/components/LoginModal';
import { RoomList } from '@/components/RoomList';
import { ChatInterface } from '@/components/ChatInterface';
import { useCurrentRoom } from '@/hooks/useChat';

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { state, joinRoom } = useChat();
  const { room } = useCurrentRoom();

  // Join room when component mounts or roomId changes
  useEffect(() => {
    if (roomId && typeof roomId === 'string') {
      const roomExists = state.rooms.find(r => r.id === roomId);
      if (roomExists) {
        joinRoom(roomId);
      } else {
        // Redirect to home if room doesn't exist
        router.push('/');
      }
    }
  }, [roomId, state.rooms, joinRoom, router]);

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
          onRoomSelect={(newRoomId) => {
            joinRoom(newRoomId);
            router.push(`/chat/${newRoomId}`);
          }}
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
                Loading chat room...
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { ChatRoom } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { formatMessageTime } from '@/lib/chatUtils';

interface RoomListProps {
  rooms: ChatRoom[];
  currentRoom: string | null;
  onRoomSelect: (roomId: string) => void;
}

export function RoomList({ rooms, currentRoom, onRoomSelect }: RoomListProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header with user info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback style={{ backgroundColor: user?.color }}>
                {user?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-8 w-8 p-0"
          >
            <span className="text-lg">⚙️</span>
          </Button>
        </div>
        
        {isUserMenuOpen && (
          <div className="mt-2 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Chat App Title */}
      <div className="p-4">
        <h1 className="text-lg font-bold">Modern Chat</h1>
        <p className="text-sm text-muted-foreground">Choose a room to start chatting</p>
      </div>

      <Separator />

      {/* Room List */}
      <div className="flex-1">
        <div className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Chat Rooms
          </h2>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant={currentRoom === room.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => onRoomSelect(room.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={room.avatar} alt={room.name} />
                    <AvatarFallback>
                      {room.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">
                        {room.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(room.lastActivity)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {room.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {room.memberCount} members
                      </Badge>
                      {currentRoom === room.id && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Modern Chat v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
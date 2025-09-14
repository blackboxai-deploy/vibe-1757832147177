'use client';

import { ChatRoom } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ChatHeaderProps {
  room: ChatRoom;
  onlineCount: number;
}

export function ChatHeader({ room, onlineCount }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={room.avatar} alt={room.name} />
            <AvatarFallback>
              {room.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-lg font-semibold">{room.name}</h2>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {room.memberCount} members
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-300">
                {onlineCount} online
              </Badge>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-lg">🔍</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-lg">📌</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-lg">⚙️</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
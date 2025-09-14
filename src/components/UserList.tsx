'use client';

import { User } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getOnlineStatus } from '@/lib/chatUtils';
import { botUsers } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentRoom } from '@/hooks/useChat';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const { user: currentUser } = useAuth();
  const { room } = useCurrentRoom();

  // Combine real users with bot users for display
  const allUsers = [
    ...(currentUser ? [currentUser] : []),
    ...botUsers.filter(bot => bot.id !== currentUser?.id),
    ...users.filter(u => u.id !== currentUser?.id && !botUsers.some(bot => bot.id === u.id))
  ];

  // Sort users: online first, then by username
  const sortedUsers = allUsers.sort((a, b) => {
    if (a.isOnline !== b.isOnline) {
      return b.isOnline ? 1 : -1;
    }
    return a.username.localeCompare(b.username);
  });

  const onlineCount = sortedUsers.filter(u => u.isOnline).length;
  const totalCount = sortedUsers.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Members</h3>
          <Badge variant="secondary" className="text-xs">
            {onlineCount}/{totalCount}
          </Badge>
        </div>
        {room && (
          <p className="text-xs text-muted-foreground mt-1">
            {room.name}
          </p>
        )}
      </div>

      {/* Online Users */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Online Section */}
          {onlineCount > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Online — {onlineCount}
              </h4>
              <div className="space-y-2">
                {sortedUsers
                  .filter(user => user.isOnline)
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback style={{ backgroundColor: user.color }}>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">
                            {user.username}
                            {user.id === currentUser?.id && (
                              <span className="text-xs text-muted-foreground ml-1">(You)</span>
                            )}
                          </p>
                        </div>
                        <p className="text-xs text-green-600 font-medium">
                          Online
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Offline Users */}
          {totalCount > onlineCount && (
            <>
              {onlineCount > 0 && <Separator />}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Offline — {totalCount - onlineCount}
                </h4>
                <div className="space-y-2">
                  {sortedUsers
                    .filter(user => !user.isOnline)
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-60">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.username} />
                            <AvatarFallback style={{ backgroundColor: user.color }}>
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.username}
                            {user.id === currentUser?.id && (
                              <span className="text-xs text-muted-foreground ml-1">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getOnlineStatus(user)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer with room stats */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{onlineCount} online</span>
            <span>•</span>
            <span>{totalCount} total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
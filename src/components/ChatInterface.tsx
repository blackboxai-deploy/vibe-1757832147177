'use client';

import { useEffect, useRef } from 'react';
import { useCurrentRoom } from '@/hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { groupMessagesByDate } from '@/lib/chatUtils';
import { Message } from '@/types/chat';

export function ChatInterface() {
  const { room, messages, onlineUsers, typingUsers } = useCurrentRoom();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Room not found
          </h2>
          <p className="text-muted-foreground">
            The requested chat room doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-1">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader room={room} onlineCount={onlineUsers.length} />

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => {
              const messages = dateMessages as Message[];
              return (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center py-4">
                    <div className="bg-muted px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-muted-foreground">
                        {date}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-2">
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        showAvatar={index === messages.length - 1 || 
                          (index < messages.length - 1 && 
                           messages[index + 1].userId !== message.userId)}
                        isGrouped={index > 0 && 
                          messages[index - 1].userId === message.userId}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-2">
                <div className="text-sm text-muted-foreground italic">
                  {typingUsers.length === 1 ? (
                    `${typingUsers[0].username} is typing...`
                  ) : typingUsers.length === 2 ? (
                    `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`
                  ) : (
                    `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <MessageInput />
        </div>
      </div>

      {/* Right Sidebar with Online Users */}
      <div className="w-64 border-l border-border bg-card">
        <UserList users={onlineUsers} />
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { formatMessageTime } from '@/lib/chatUtils';

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
  isGrouped: boolean;
}

export function MessageBubble({ message, showAvatar, isGrouped }: MessageBubbleProps) {
  const { user } = useAuth();
  const { addReaction, removeReaction } = useChat();
  const [showReactions, setShowReactions] = useState(false);
  
  const isOwnMessage = user?.id === message.userId;
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const handleReaction = (emoji: string) => {
    const existingReaction = message.reactions?.find(
      r => r.userId === user?.id && r.emoji === emoji
    );

    if (existingReaction) {
      removeReaction(message.id, emoji);
    } else {
      addReaction(message.id, emoji);
    }
    
    setShowReactions(false);
  };

  const reactionCounts = message.reactions?.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[70%]`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage ? (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.userAvatar} alt={message.username} />
            <AvatarFallback style={{ backgroundColor: message.userColor }}>
              {message.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8" />
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Username and Time */}
          {!isGrouped && (
            <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className="text-sm font-medium" style={{ color: message.userColor }}>
                {message.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatMessageTime(message.timestamp)}
              </span>
              {message.isEdited && (
                <Badge variant="secondary" className="text-xs">
                  edited
                </Badge>
              )}
            </div>
          )}

          {/* Message Bubble */}
          <div className="relative">
            <div
              className={`px-3 py-2 rounded-lg max-w-full break-words ${
                isOwnMessage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Reaction Button (appears on hover) */}
            <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 bg-background border border-border rounded-full"
                onClick={() => setShowReactions(!showReactions)}
              >
                <span className="text-xs">😊</span>
              </Button>
              
              {/* Reaction Picker */}
              {showReactions && (
                <div className="absolute top-8 right-0 bg-background border border-border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                  {commonReactions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => handleReaction(emoji)}
                    >
                      <span className="text-sm">{emoji}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Existing Reactions */}
          {Object.keys(reactionCounts).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(reactionCounts).map(([emoji, count]) => {
                const userReacted = message.reactions?.some(
                  r => r.userId === user?.id && r.emoji === emoji
                );
                
                return (
                  <Button
                    key={emoji}
                    variant={userReacted ? "secondary" : "outline"}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleReaction(emoji)}
                  >
                    <span className="mr-1">{emoji}</span>
                    <span>{count}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
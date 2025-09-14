'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { isValidMessage, sanitizeMessage } from '@/lib/chatUtils';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTyping } = useChat();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    const sanitizedMessage = sanitizeMessage(message);
    
    if (isValidMessage(sanitizedMessage)) {
      sendMessage(sanitizedMessage);
      setMessage('');
      setIsTyping(false);
      setTyping(false);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Handle typing indicators
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      setTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
      setTyping(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const remainingChars = 2000 - message.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="min-h-[40px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
          
          {/* Character counter */}
          {message.length > 1800 && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              <span className={remainingChars < 100 ? 'text-orange-500' : remainingChars < 0 ? 'text-red-500' : ''}>
                {remainingChars}
              </span>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || message.length > 2000}
          className="self-end"
        >
          <span className="text-lg">📤</span>
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex space-x-4">
          <span>Shift+Enter for new line</span>
          {isTyping && (
            <span className="text-blue-500 font-medium">Typing...</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              setMessage(prev => prev + ' 👍');
              textareaRef.current?.focus();
            }}
          >
            👍
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              setMessage(prev => prev + ' ❤️');
              textareaRef.current?.focus();
            }}
          >
            ❤️
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              setMessage(prev => prev + ' 😂');
              textareaRef.current?.focus();
            }}
          >
            😂
          </Button>
        </div>
      </div>
    </form>
  );
}
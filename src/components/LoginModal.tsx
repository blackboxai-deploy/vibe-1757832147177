'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function LoginModal() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    setIsLoading(true);
    
    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    login(username.trim());
    setIsLoading(false);
  };

  const handleQuickLogin = (name: string) => {
    setUsername(name);
    login(name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Modern Chat</CardTitle>
          <CardDescription>
            Enter your username to join the conversation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                maxLength={20}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Chat'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or quick login as
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('Demo User')}
              className="text-sm"
            >
              Demo User
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('Guest')}
              className="text-sm"
            >
              Guest
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Join multiple chat rooms and connect with others!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
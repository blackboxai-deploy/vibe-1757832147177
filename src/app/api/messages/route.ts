import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types/chat';

// In a real application, this would connect to a database
// For now, we'll return mock data or handle client-side storage

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  
  if (!roomId) {
    return NextResponse.json(
      { error: 'Room ID is required' },
      { status: 400 }
    );
  }

  // In a real app, fetch messages from database
  // For this demo, we'll return empty array as client handles mock data
  return NextResponse.json({
    messages: [],
    roomId,
    success: true
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, userId, username, roomId } = body;

    // Validate required fields
    if (!content || !userId || !username || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, save to database
    const newMessage: Partial<Message> = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      userId,
      username,
      roomId,
      timestamp: new Date(),
      reactions: []
    };

    // Return the created message
    return NextResponse.json({
      message: newMessage,
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const roomId = searchParams.get('roomId');

    if (!messageId || !roomId) {
      return NextResponse.json(
        { error: 'Message ID and Room ID are required' },
        { status: 400 }
      );
    }

    // In a real application, delete from database
    return NextResponse.json({
      messageId,
      roomId,
      success: true
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
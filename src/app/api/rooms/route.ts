import { NextRequest, NextResponse } from 'next/server';
import { ChatRoom } from '@/types/chat';
import { mockRooms } from '@/lib/mockData';

export async function GET() {
  try {
    // In a real application, fetch rooms from database
    // For this demo, return mock rooms
    return NextResponse.json({
      rooms: mockRooms,
      success: true
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isPrivate } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Create new room
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      isPrivate: isPrivate || false,
      memberCount: 1,
      lastActivity: new Date(),
      avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5000de4d-1c49-4a38-ac07-d7916a66b5b1.png}+room+icon`
    };

    // In a real application, save to database
    return NextResponse.json({
      room: newRoom,
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, isPrivate } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // In a real application, update room in database
    const updatedRoom = {
      id,
      name: name?.trim(),
      description: description?.trim(),
      isPrivate,
      lastActivity: new Date()
    };

    return NextResponse.json({
      room: updatedRoom,
      success: true
    });

  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // In a real application, delete room from database
    return NextResponse.json({
      roomId,
      success: true
    });

  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
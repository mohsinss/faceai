import { NextResponse } from 'next/server';
import connectMongo from '../../../libs/mongoose';
import ChatConversation from '../../../models/ChatConversation';

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { analyticsId, message, isInitial } = body;

    if (!analyticsId || !message) {
      return NextResponse.json({ 
        error: 'Analytics ID and message are required' 
      }, { status: 400 });
    }

    // Find or create conversation
    let conversation = await ChatConversation.findOne({ analyticsId });
    
    if (!conversation) {
      conversation = new ChatConversation({
        analyticsId,
        messages: []
      });
    }

    // Add user message (except for initial AI message)
    if (!isInitial) {
      conversation.messages.push({
        content: message,
        isUser: true,
        timestamp: new Date()
      });

      // Here you can integrate with your AI service to get the response
      // For now, we'll use a simple response
      const aiResponse = "I'm analyzing your request. Let me help you with that.";
      
      // Add AI response
      conversation.messages.push({
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      });

      conversation.lastUpdated = new Date();
      await conversation.save();

      return NextResponse.json({
        message: 'Message saved successfully',
        aiResponse
      }, { status: 200 });
    } else {
      // For initial message, just save the AI welcome message
      conversation.messages.push({
        content: message,
        isUser: false,
        timestamp: new Date()
      });

      conversation.lastUpdated = new Date();
      await conversation.save();

      return NextResponse.json({
        message: 'Initial message saved successfully'
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const analyticsId = searchParams.get('analyticsId');

    if (!analyticsId) {
      return NextResponse.json({ 
        error: 'Analytics ID is required' 
      }, { status: 400 });
    }

    const conversation = await ChatConversation.findOne({ analyticsId }).lean();

    if (!conversation) {
      return NextResponse.json({ 
        messages: [] 
      }, { status: 200 });
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
} 
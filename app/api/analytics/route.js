import { NextResponse } from 'next/server';
import connectMongo from '../../../libs/mongoose';
import Analytics from '../../../models/Analytics';

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();

    if (body._id) {
      const result = await Analytics.findByIdAndUpdate(
        body._id,
        { 
          ...body,
          generatedContent: body.generatedContent,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!result) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Analytics saved successfully' }, { status: 200 });
    } else {
      const newAnalytics = new Analytics({
        ...body,
        createdAt: new Date()
      });

      const result = await newAnalytics.save();

      return NextResponse.json({
        documentId: result._id,
        message: 'Document created successfully'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let id = searchParams.get('id');

  try {
    await connectMongo();

    if (id) {
      const analytics = await Analytics.findById(id).lean();
      
      if (!analytics) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      return NextResponse.json(analytics, { status: 200 });
    }

    // Fetch all documents, sorted by createdAt in descending order
    const analytics = await Analytics.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();
    const { id } = await req.json();

    const result = await Analytics.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 
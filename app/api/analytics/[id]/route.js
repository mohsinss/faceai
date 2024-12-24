import { NextResponse } from 'next/server';
import connectMongo from '../../../../libs/mongoose';
import Analytics from '../../../../models/Analytics';  // You'll need to rename this model file
import { Types } from 'mongoose';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectMongo();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid document ID' }, { status: 400 });
    }

    const document = await Analytics.findById(new Types.ObjectId(id)).lean().exec();

    if (!document) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
} 
//Users/mohsinal/saasbase/app/api/feasibility/[id]/route.js

import { NextResponse } from 'next/server';
import connectMongo from '../../../../libs/mongoose';
import Feasibility from '../../../../models/Feasibility';
import { Types } from 'mongoose';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectMongo(); // Establishes connection to MongoDB using Mongoose

    // Check if the id is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid document ID' }, { status: 400 });
    }

    // Find the document by ID using Mongoose
    const document = await Feasibility.findById(new Types.ObjectId(id)).lean().exec();

    if (!document) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
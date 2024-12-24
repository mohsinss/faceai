//Users/mohsinal/saasbase/app/api/feasibility/route.js

import { getDb } from '../../../libs/mongo';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const db = await getDb();
    const collection = db.collection(process.env.MONGODB_COLLECTION || "analytics");
    const body = await req.json();

    if (body._id) {
      const id = body._id;
      delete body._id;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...body,
            generatedContent: body.generatedContent,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Analytics saved successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const result = await collection.insertOne({
        createdAt: new Date(),
        ...body
      });

      return new Response(JSON.stringify({
        documentId: result.insertedId,
        message: 'Document created successfully'
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let id = searchParams.get('id');

  try {
    const db = await getDb();
    const collection = db.collection(process.env.MONGODB_COLLECTION || "analytics");

    if (id) {
      id = id.replace(/[^0-9a-fA-F]/g, '');

      if (!ObjectId.isValid(id)) {
        return new Response(JSON.stringify({ error: 'Invalid ObjectId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const analytics = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!analytics) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Fetch related businessDescription and marketAnalysis
      const businessDescription = await db.collection("businessDescriptions").findOne({ analyticsId: new ObjectId(id) });
      const marketAnalysis = await db.collection("marketAnalyses").findOne({ analyticsId: new ObjectId(id) });

      // Combine the data
      const populatedAnalytics = {
        ...analytics,
        businessDescription,
        marketAnalysis,
        generatedContent: analytics.generatedContent || '',
        contentLength: analytics.contentLength || 'medium',
        tone: analytics.tone || 'professional',
        language: analytics.language || 'English',
        temperature: analytics.temperature || 0.7,
      };

      return new Response(JSON.stringify(populatedAnalytics), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch all documents, sorted by createdAt in descending order
    const analytics = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const db = await getDb();
    const collection = db.collection(process.env.MONGODB_COLLECTION || "analytics");
    const { id } = await req.json();

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Document deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
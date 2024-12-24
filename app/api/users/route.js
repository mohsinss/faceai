import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();
    const users = await User.find({}).select('-password').lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error('API - Error fetching users:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (session) {
    await connectMongo();

    const { id } = session.user;

    try {
      const user = await User.findById(id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ data: user }, { status: 200 });
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (session) {
    await connectMongo();

    const { id } = session.user;
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      const user = await User.findById(id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user.email = body.email;
      await user.save();

      return NextResponse.json({ data: user }, { status: 200 });
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
}

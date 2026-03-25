import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Server from '@/models/Server';

export async function GET(req: Request) {
  try {
    await connectDB();
    const servers = await Server.find({}).populate('ownerId', 'name email').sort({ createdAt: -1 });
    return NextResponse.json({ servers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();
    const server = new Server(data);
    await server.save();
    return NextResponse.json({ server });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    await connectDB();
    const server = await Server.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ server });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectDB();
    await Server.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

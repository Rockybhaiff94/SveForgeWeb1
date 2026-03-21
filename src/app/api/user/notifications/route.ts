import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/auth-util";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        const session = await verifyToken();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // We can fetch notifications by discordId or mongo _id depending on how it was saved
        const userId = session.userId;
        const discordIdStr = session.discordId || userId;
        
        const notifications = await Notification.find({
            $or: [
                { userId: userId },
                { userId: discordIdStr }
            ]
        }).sort({ createdAt: -1 }).limit(20);

        return NextResponse.json({ success: true, notifications });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await verifyToken();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Mark as read
        if (body.action === 'mark_read' && body.notificationId) {
             await Notification.updateOne(
                 { _id: body.notificationId, userId: { $in: [session.userId, session.discordId] } },
                 { $set: { read: true } }
             );
             return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
         return NextResponse.json({ success: false }, { status: 500 });
    }
}

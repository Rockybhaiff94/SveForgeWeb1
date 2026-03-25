import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { createLog } from '@/lib/logger';

const BANNED_KEYWORDS = ['spam', 'abuse', 'hack', 'exploit'];

export async function POST(req: Request) {
  try {
    const { content, userId } = await req.json();
    
    let flagged = false;
    let reasons: string[] = [];
    
    // Basic local keyword filter
    const lowerContent = content.toLowerCase();
    for (const keyword of BANNED_KEYWORDS) {
      if (lowerContent.includes(keyword)) {
        flagged = true;
        reasons.push(`Contains banned keyword: ${keyword}`);
      }
    }
    
    // Auto-flag logging
    if (flagged) {
      await createLog({
        action: 'AI_MODERATION_FLAG',
        type: 'WARNING',
        userId,
        targetId: userId,
        targetType: 'User',
        details: reasons.join(', ')
      });
    }
    
    return NextResponse.json({ flagged, reasons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

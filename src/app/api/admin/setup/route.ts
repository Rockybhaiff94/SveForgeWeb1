import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function GET() {
    try {
        await dbConnect();

        const email = 'admin@serverforge.test';
        const password = 'adminpassword123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await User.findOne({ email });

        if (admin) {
            admin.password = hashedPassword;
            admin.role = 'OWNER';
            await admin.save();
            return NextResponse.json({ 
                success: true, 
                message: 'Admin already existed. Password updated to default.', 
                email, 
                password 
            });
        }

        admin = new User({
            email,
            password: hashedPassword,
            role: 'OWNER',
            username: 'Admin',
            discordId: 'admin_local_' + Date.now()
        });
        
        await admin.save();

        return NextResponse.json({ 
            success: true, 
            message: 'Admin account created successfully! Please do NOT leave this route exposed in production forever.',
            email, 
            password 
        });

    } catch (error: any) {
        console.error('Setup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

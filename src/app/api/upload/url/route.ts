import { NextResponse } from 'next/server';
import { s3Client } from '@/lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyToken } from '@/lib/auth-util';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        // 1. Authenticate User
        const session = await verifyToken();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Request
        const { fileName, fileType } = await req.json();
        
        if (!fileName || !fileType) {
            return NextResponse.json({ success: false, error: 'Missing fileName or fileType' }, { status: 400 });
        }

        // 3. Generate Unique Safe Filename
        const ext = fileName.split('.').pop() || 'png';
        const uniqueId = crypto.randomBytes(16).toString('hex');
        const s3Key = `uploads/${session.userId}/${uniqueId}.${ext}`;
        const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

        if (!bucketName) {
            console.error('Missing AWS_S3_BUCKET_NAME in environment variables.');
            return NextResponse.json({ success: false, error: 'Server misconfiguration: S3 Bucket missing' }, { status: 500 });
        }

        // 4. Create PutObject Command
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            ContentType: fileType,
        });

        // 5. Generate Signed URL (valid for 60 seconds)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        // Calculate the final public URL where the image will reside
        const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;

        return NextResponse.json({
            success: true,
            uploadUrl: signedUrl,
            publicUrl: publicUrl
        });

    } catch (error: any) {
        console.error('Error generating S3 presigned URL:', error);
        return NextResponse.json({ success: false, error: 'Failed to generate upload URL', details: error.message }, { status: 500 });
    }
}

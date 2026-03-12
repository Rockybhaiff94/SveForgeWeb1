const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function test() {
    try {
        console.log('Minting test token...');
        const token = jwt.sign({ userId: '65f1a3b2c4d5e6f7a8b9c0d1', discordId: '123456789' }, process.env.JWT_SECRET);
        
        console.log('Fetching Presigned URL from Next.js Auth API...');
        const res = await fetch('http://localhost:3000/api/upload/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=' + token
            },
            body: JSON.stringify({ fileName: 'test-upload.jpg', fileType: 'image/jpeg' })
        });
        
        const data = await res.json();
        console.log('API Response:', data);
        
        if (!data.success) throw new Error('API failed to generate URL: ' + JSON.stringify(data));

        console.log('Uploading dummy image to S3...');
        const dummyBuffer = Buffer.from('dummy image content');
        
        const uploadRes = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: dummyBuffer,
            headers: { 'Content-Type': 'image/jpeg' }
        });
        
        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            throw new Error(`S3 Upload Failed: ${uploadRes.status} ${err}`);
        }
        
        console.log('SUCCESS! AWS Credentials and S3 Bucket are fully operational!');
        console.log('File available at:', data.publicUrl);
    } catch(e) {
        console.error(e);
    }
}
test();

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

async function testVercel() {
    try {
        console.log('Minting production test token...');
        const token = jwt.sign({ userId: 'vercel_tester', discordId: '123' }, process.env.JWT_SECRET);
        
        console.log('Fetching Presigned URL from https://serverforge.xyz...');
        const res = await fetch('https://serverforge.xyz/api/upload/url', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Cookie': 'token=' + token 
            },
            body: JSON.stringify({ fileName: 'vercel-test.jpg', fileType: 'image/jpeg' })
        });
        
        const data = await res.json();
        
        if (!data.success) {
            console.error('❌ VERCEL API FAILED');
            console.error('If this says "Server misconfiguration", you forgot to add the AWS variables to your Vercel Project Settings!');
            console.error(JSON.stringify(data, null, 2));
            return;
        }

        console.log('✅ Vercel API Success! Generated AWS URL.');
        console.log('Simulating browser CORS upload to S3 from serverforge.xyz...');
        
        const uploadRes = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: Buffer.from('dummy vercel image'),
            headers: { 
                'Content-Type': 'image/jpeg',
                'Origin': 'https://serverforge.xyz' 
            }
        });
        
        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            console.error('\n❌ VERCEL S3 UPLOAD FAILED');
            console.error(`Status: ${uploadRes.status}`);
            console.error(`Message: ${err}`);
        } else {
            console.log('\n✅ VERCEL UPLOAD 100% SUCCESSFUL!');
            console.log(`Live Image URL hosted at: ${data.publicUrl}`);
        }
    } catch(e) {
        console.error('Test script error:', e);
    }
}
testVercel();

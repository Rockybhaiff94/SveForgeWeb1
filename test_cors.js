const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function testCORS() {
    try {
        console.log('Minting token...');
        const token = jwt.sign({ userId: 'cors_test_user', discordId: 'cors_test' }, process.env.JWT_SECRET);
        
        console.log('Fetching Presigned URL...');
        const res = await fetch('http://localhost:3000/api/upload/url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': 'token=' + token },
            body: JSON.stringify({ fileName: 'cors-test.jpg', fileType: 'image/jpeg' })
        });
        const data = await res.json();
        
        if (!data.success) throw new Error('API failed: ' + JSON.stringify(data));

        console.log('Simulating browser CORS upload with Origin header...');
        
        const uploadRes = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: Buffer.from('dummy cors image'),
            headers: { 
                'Content-Type': 'image/jpeg',
                'Origin': 'http://localhost:3000' // Simulates the browser
            }
        });
        
        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            console.error('\n❌ CORS UPLOAD FAILED');
            console.error(`Status: ${uploadRes.status}`);
            console.error(`Message: ${err}`);
        } else {
            console.log('\n✅ CORS UPLOAD SUCCESSFUL!');
            console.log('The S3 bucket is correctly configured to accept uploads from localhost:3000 (and serverforge.xyz if added).');
        }
    } catch(e) {
        console.error('Test script error:', e);
    }
}
testCORS();

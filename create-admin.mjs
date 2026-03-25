import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env or .env.local');
}

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    username: { type: String },
    discordId: { type: String }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@serverforge.test';
        const password = 'adminpassword123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        let admin = await User.findOne({ email });
        
        if (admin) {
            console.log('Admin user already exists!');
            admin.password = hashedPassword;
            admin.role = 'OWNER';
            await admin.save();
            console.log('Updated existing admin password and role.');
        } else {
            admin = new User({
                email,
                password: hashedPassword,
                role: 'OWNER',
                username: 'Admin',
                discordId: 'admin_local_' + Date.now()
            });
            await admin.save();
            console.log('Successfully created new Admin user!');
        }

        console.log('\n--- Login Credentials ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();

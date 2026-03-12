import mongoose from 'mongoose';
import dns from 'dns';
import { startMonitoring } from './monitor';

// Force DNS to resolve IPv4 first to avoid querySrv ECONNREFUSED issues in some environments
dns.setDefaultResultOrder('ipv4first');

declare global {
    var mongoose: any; // Using any for simplicity in this case
}


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const opts = {
            bufferCommands: false,
            family: 4, // Force IPv4
        };

        console.log('Connecting to MongoDB with URI starting with:', MONGODB_URI.substring(0, 20) + '...');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected Successfully');
            
            // Boot the background monitoring worker
            startMonitoring();
            
            return mongoose;
        }).catch(err => {
            console.error('MongoDB Connection Error Details:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

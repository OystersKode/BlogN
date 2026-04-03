import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const clearDB = async () => {
    try {
        console.log('--- Database Reset Initiated ---');
        console.log('Connecting to MongoDB...');
        
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        // Extract collection names
        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection failed');
        
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log(`Found ${collectionNames.length} collections. Clearing...`);

        for (const name of collectionNames) {
            // Note: We avoid dropping system collections if any
            if (name === 'system.indexes') continue;
            
            await db.collection(name).deleteMany({});
            console.log(`[CLEARED] ${name}`);
        }

        console.log('--- Database Reset Complete ---');
        console.log('Platform is now in a zero state. Ready for deployment.');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Database reset failed:', error);
        process.exit(1);
    }
};

clearDB();

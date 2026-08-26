import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer_team_builder';
  
  try {
    // Attempt connecting to configured URI with short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected to standalone server: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local MongoDB at ${uri}. Initializing in-memory MongoMemoryServer...`);
    try {
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ MongoDB Connected to in-memory instance: ${memoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

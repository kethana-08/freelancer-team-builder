import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set.');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `✅ MongoDB Connected: ${mongoose.connection.host}`
    );
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

export const closeDB = async () => {
  await mongoose.disconnect();
};
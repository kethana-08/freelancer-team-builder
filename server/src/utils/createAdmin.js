import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const createAdmin = async () => {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required.');
  }

  await mongoose.connect(MONGODB_URI);

  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');

  if (existingUser) {
    existingUser.role = 'admin';
    existingUser.password = ADMIN_PASSWORD;
    existingUser.isActive = true;
    await existingUser.save();
  } else {
    await User.create({
      name: 'Platform Administrator',
      email: normalizedEmail,
      password: ADMIN_PASSWORD,
      role: 'admin',
      title: 'Platform Administrator',
      isActive: true
    });
  }

  console.log(`Admin account provisioned for ${normalizedEmail}.`);
  await mongoose.disconnect();
};

createAdmin().catch(async (error) => {
  console.error(`Admin provisioning failed: ${error.message}`);
  await mongoose.disconnect();
  process.exitCode = 1;
});

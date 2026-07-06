import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import mongoose from 'mongoose';
import Product from '../src/models/Product';

async function run() {
  console.log('--- DIAGNOSTICS ---');
  console.log('Using MONGODB_URI:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const count = await Product.countDocuments();
    console.log(`Cloud Database Products Count: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to connect to Cloud Database:', err);
  }

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/royal-furniture');
    const count = await Product.countDocuments();
    console.log(`Local Database Products Count: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.log('Local MongoDB not running or failed to query.');
  }
}

run();

import mongoose from 'mongoose';
import connectDB from './lib/db';
import Notification from './models/Notification';

const checkNotifications = async () => {
    await connectDB();
    const all = await Notification.find({}).sort({ createdAt: -1 }).limit(5).lean();
    console.log('Last 5 notifications:', JSON.stringify(all, null, 2));
    process.exit(0);
};

checkNotifications();

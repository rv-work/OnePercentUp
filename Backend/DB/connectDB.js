import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://ruvishushukla1:fgrfVvpKFPNy0xwd@onepercentup.pkb9j3p.mongodb.net/OnePercentUp?retryWrites=true&w=majority&appName=OnePercentUp");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); 
  }
};

// Handles the connection between our Express app and MongoDB Atlas
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise — we await the connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure — no point running a server with no DB
    process.exit(1);
  }
};

export default connectDB;
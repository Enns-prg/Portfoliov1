const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We'll replace this string with your real one later
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
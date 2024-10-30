import mongoose from 'mongoose';

const mongodb_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB as string);
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error in MongoDB:", error);
    process.exit(1);
  }
};

export default mongodb_connection;

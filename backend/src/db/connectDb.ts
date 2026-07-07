import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) return console.log(`Mongo URI not found`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to db`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("Error in database connection", error);
    process.exit(1);
  }
};
export default connectDB;

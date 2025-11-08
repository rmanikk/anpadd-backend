import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("data base is connected");
  } catch (error) {
    console.log("db error",error);
  }
};



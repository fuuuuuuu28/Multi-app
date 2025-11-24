import mongoose from "mongoose";

export const connected = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Success connection");
  } catch (error:any) {
    console.log("Fail connection",error.message);
  }
};

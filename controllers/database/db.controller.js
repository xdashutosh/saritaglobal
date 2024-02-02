import mongoose from "mongoose";

export const dbConnection = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Successfully connected to the database")
  } catch (err) {
    console.error(err);
  }
};

import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "user"
    },
    name: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true },
);

const User = mongoose.model("User", user);

export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    email_verified: { type: String, required: true, default: false },
    verification_token: { type: Number, required: true },
    verification_token_time: { type: Date, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true, default: "user" },
    status: { type: String, required: true, default: "active" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;

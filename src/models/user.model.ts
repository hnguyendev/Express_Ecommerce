import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  email_verified: boolean;
  verification_token: number;
  verification_token_time: Date;
  password: string;
  reset_password_token: number;
  reset_password_token_time: Date;
  type: string;
  status: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, required: true, default: false },
    verification_token: { type: Number, required: true },
    verification_token_time: { type: Date, required: true },
    password: { type: String, required: true, select: false },
    reset_password_token: { type: Number, required: false },
    reset_password_token_time: { type: Date, required: false },
    type: { type: String, required: true, default: "user" },
    status: { type: String, required: true, default: "active" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model<IUser>("Users", userSchema);
export default UserModel;

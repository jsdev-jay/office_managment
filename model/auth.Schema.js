import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { authRole } from "../constants/enum.js";
const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: Object.values(authRole),
    default: authRole.EMPLOYEE,
  },
});

authSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const Auth = mongoose.model("Auth", authSchema);
export default Auth;

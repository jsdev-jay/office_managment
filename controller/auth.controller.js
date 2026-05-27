import Auth from "../model/auth.Schema.js";
import bcrypt from "bcrypt";
import { genrateToken } from "../middleware/auth.middleware.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    const emailExists = await Auth.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const auth = await Auth.create({ name, email, password });
    res.status(201).json({ name, email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const auth = await Auth.findOne({ email });
    if (!auth) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = genrateToken(auth);
    res.status(200).json({ auth, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const auth = await Auth.findById(req.userData.id);
    if (!auth) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(auth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    const auth = await Auth.findById(req.userData.id);
    if (!auth) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, auth.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    auth.password = newPassword;
    await auth.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

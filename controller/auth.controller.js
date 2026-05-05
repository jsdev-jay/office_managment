import Auth from "../model/auth.Schema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/auth.middleware.js";
import { authRole } from "../constants/enum.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role = authRole.EMPLOYEE } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (role && !Object.values(authRole).includes(role)) {
      return res
        .status(400)
        .json({ message: `Allowed roles are ${Object.values(authRole)}` });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    const emailExists = await Auth.findOne({ email }).lean();
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
    const record = await Auth.create({
      name: name,
      email: email,
      password: password,
      role: role,
    });
    res.status(201).json({
      message: "User registered successfully",
      data: { name, email },
    });
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
    const token = generateToken(auth);
    res
      .status(200)
      .json({ message: "Login successful", data: { auth, token } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const auth = await Auth.findById(req.userData.id).lean();
    if (!auth) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!req.userData) {
      return res.status(400).json({ message: "login again" });
    }
    const yourProfile = {};
    yourProfile.id = req.userData.id;
    yourProfile.email = req.userData.email;
    yourProfile.name = req.userData.name;
    yourProfile.role = req.userData.role;
    return res.status(200).json({
      message: "Your data fetched successfully",
      data: { ...yourProfile },
    });
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
    if (oldPassword.length < 6 || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
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

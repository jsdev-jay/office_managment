import mongoose from "mongoose";
import { authRole, employeeStatus } from "../constants/enum.js";
const employeeSchema = new mongoose.Schema({
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
  phone: {
    type: Number,
    required: true,
    match: /^\d{10}$/,
    unique: true,
  },
  role: {
    type: String,
    default: authRole.EMPLOYEE,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enums: Object.values(employeeStatus),
    default: employeeStatus.ACTIVE,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;

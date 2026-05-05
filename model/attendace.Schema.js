import mongoose from "mongoose";
import { attendanceStatus } from "../constants/enum.js";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  date: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
  },
  hoursWorked: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(attendanceStatus),
    default: attendanceStatus.ABSENT,
  },
  note: {
    type: String,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;

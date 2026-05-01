import mongoose from "mongoose";
import { leavetype, leaveStatus } from "../constants/enum.js";

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  type: {
    type: String,
    enum: Object.values(leavetype),
    default: leavetype.SICK,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(leaveStatus),
    default: leaveStatus.PENDING,
  },
  reviewNote: {
    type: String,
    default: "",
  },
});

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;

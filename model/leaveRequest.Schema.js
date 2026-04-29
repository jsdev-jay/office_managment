import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  type: {
    type: String,
    enum: ["sick", "casual", "unpaid"],
    default: "sick",
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
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
  reviewNote: {
    type: String,
    default: "",
  },
});

export default mongoose.model("LeaveRequest", leaveRequestSchema);

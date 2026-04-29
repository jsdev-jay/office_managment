import mongoose from "mongoose";

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
    enum: ["present", "absent", "late"],
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Attendance", attendanceSchema);

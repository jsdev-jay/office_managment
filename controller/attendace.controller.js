import Attendance from "../model/attendace.Schema.js";
import Employee from "../model/employe.Schema.js";
import mongoose from "mongoose";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export function calculateWorkHours(checkInTime, checkOutTime) {
  const [inHours, inMinutes] = checkInTime.split(":").map(Number);
  const [outHours, outMinutes] = checkOutTime.split(":").map(Number);

  let checkInTotalMinutes = inHours * 60 + inMinutes;
  let checkOutTotalMinutes = outHours * 60 + outMinutes;

  let diffMinutes = checkOutTotalMinutes - checkInTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
}

// Check-in API
export const checkIn = async (req, res) => {
  try {
    const { employeeId, date, checkInTime } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const inputDate = dayjs(date, "YYYY-MM-DD", true);
    if (!inputDate.isValid()) {
      return res
        .status(400)
        .json({ message: "Date is not in correct format (YYYY-MM-DD)" });
    }

    const today = dayjs().startOf("day");

    if (inputDate.isAfter(today)) {
      return res.status(400).json({ message: "Future date is not allowed" });
    }

    if (inputDate.isBefore(today)) {
      return res.status(400).json({ message: "Past date is not allowed" });
    }

    if (!checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }

    const validTime = dayjs(checkInTime, "HH:mm", true);
    if (!validTime.isValid()) {
      return res.status(400).json({
        message: "Check-in time must be in HH:mm format",
      });
    }

    const status = inputDate.isSame(today) ? "present" : "absent";

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date,
    }).lean();

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already exists for this date",
      });
    }

    const attendance = await Attendance.create({
      employeeId,
      date: inputDate.format("YYYY-MM-DD"),
      checkInTime,
      status,
    });

    return res.status(201).json({
      message: "Attendance created successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// Checkout API
export const checkOut = async (req, res) => {
  try {
    const { employeeId, checkOutTime, date } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "employeeId is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "employeeId is not valid",
      });
    }
    if (!checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "checkOutTime is required",
      });
    }
    if (!dayjs(checkOutTime, "HH:mm", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "checkOutTime is not valid",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }
    if (!dayjs(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "date is not valid",
      });
    }
    const todayDate = dayjs().format("YYYY-MM-DD");

    const [employee, attendance] = await Promise.all([
      Employee.findById(employeeId).lean(),
      Attendance.findOne({
        employeeId,
        date: todayDate,
      }),
    ]);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Check-in not found for today",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    const workingHours = calculateWorkHours(
      attendance.checkInTime,
      checkOutTime,
    );
    attendance.checkOutTime = checkOutTime;
    attendance.workingHours = workingHours;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Checkout successful",
      data: {
        employeeId: attendance.employeeId,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        workingHours: attendance.workingHours,
        date: attendance.date,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all attendance

export const getAllAttendance = async (req, res) => {
  try {
    let { employeeId, date, month, year } = req.query;

    let filter = {};

    if (employeeId) {
      filter.employeeId = employeeId;
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    const employee = await Employee.findById(employeeId).lean();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (date) {
      const selectedDate = new Date(date);
      const start = new Date(selectedDate.setHours(0, 0, 0, 0));
      const end = new Date(selectedDate.setHours(23, 59, 59, 999));

      filter.date = { $gte: start, $lte: end };
    }

    if (month) {
      const selectedYear = year ? parseInt(year) : new Date().getFullYear();

      const start = new Date(selectedYear, month - 1, 1);
      const end = new Date(selectedYear, month, 0, 23, 59, 59);

      filter.date = { $gte: start, $lte: end };
    }

    let query = Attendance.find(filter)
      .populate({
        path: "employeeId",
        select: "name",
      })
      .sort({ date: -1 })
      .lean();

    let attendance = await query;

    res.status(200).json({
      message: "All attendance records fetched",
      total: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};

// get attendance by id
export const getAttendanceById = async (req, res) => {
  try {
    let { month, year, employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "employeeId is not valid" });
    }

    if (!month || !year) {
      return res.status(400).json({
        message: "month and year are required",
      });
    }

    month = parseInt(month);
    year = parseInt(year);

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).json({
        message: "month and year must be valid numbers",
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        message: "month must be between 1-12",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: "employeeId",
        select: "name",
      })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      total: attendance.length,
      month,
      year,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};

// update attendance

export const updateAttendance = async (req, res) => {
  try {
    const { checkInTime, checkOutTime, status } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "attendance id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    if (!checkInTime || !checkOutTime || !status) {
      return res.status(400).json({
        message: "checkInTime, checkOutTime and status are required",
      });
    }

    const checkIn = dayjs(checkInTime, "HH:mm", true);
    const checkOut = dayjs(checkOutTime, "HH:mm", true);

    if (!checkIn.isValid()) {
      return res.status(400).json({
        message: "Check-in time must be in HH:mm format",
      });
    }

    if (!checkOut.isValid()) {
      return res.status(400).json({
        message: "Check-out time must be in HH:mm format",
      });
    }

    if (checkOut.isBefore(checkIn)) {
      return res.status(400).json({
        message: "Check-out time cannot be before check-in time",
      });
    }

    const totalMinutes = checkOut.diff(checkIn, "minute");
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const workedHours = `${hours}h ${minutes}m`;

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      {
        checkInTime,
        checkOutTime,
        status,
        workedHours,
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updatedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attendance",
      error: error.message,
    });
  }
};

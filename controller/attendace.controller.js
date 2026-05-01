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

// check in

export const checkIn = async (req, res) => {
  try {
    const { employeeId, date, checkInTime } = req.body;
    let status;
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
    if (!dayjs(date, "DD-MM-YYYY", true).isValid()) {
      return res.status(400).json({ message: "Date is not in correct format" });
    }

    if (!checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }
    if (!dayjs(checkInTime, "HH:mm", true).isValid()) {
      return res
        .status(400)
        .json({ message: "Check-in time is not in correct format" });
    }
    if (new Date(date).toDateString() == new Date().toDateString()) {
      status = "present";
    } else if (new Date(date).toISOString() > new Date().toISOString()) {
      return res.status(400).json({ message: "Future date is not allowed" });
    } else {
      status = "absent";
    }
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
      date,
      checkInTime,
      status,
    });
    res.status(201).json({
      message: "Attendance created successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    if (!dayjs(date, "DD-MM-YYYY", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "date is not valid",
      });
    }
    const todayDate = dayjs().format("DD-MM-YYYY");

    const [employee, attendance] = await Promise.all([
      Employee.findById(employeeId).lean(),
      Attendance.findOne({
        employeeId,
        date: todayDate,
      }).lean(),
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
    let { employeeId, date, month, year, departmentId } = req.query;

    let filter = {};

    if (employeeId) {
      filter.employeeId = employeeId;
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (date) {
      const selectedDate = new Date(date);
      const start = new Date(selectedDate.setHours(0, 0, 0, 0));
      const end = new Date(selectedDate.setHours(23, 59, 59, 999));

      filter.checkIn = { $gte: start, $lte: end };
    }

    if (month) {
      const selectedYear = year ? parseInt(year) : new Date().getFullYear();

      const start = new Date(selectedYear, month - 1, 1);
      const end = new Date(selectedYear, month, 0, 23, 59, 59);

      filter.checkIn = { $gte: start, $lte: end };
    }

    let query = Attendance.find(filter)
      .populate({
        path: "employeeId",
        select: "name email department",
        populate: {
          path: "departmentId",
          select: "name",
        },
      })
      .sort({ checkIn: -1 });

    let attendance = await query;

    if (departmentId) {
      attendance = attendance.filter(
        (a) => a.user?.department?._id.toString() === departmentId.toString(),
      );
    }

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
    let { month, year, employeeId } = req.body;

    // validate employeeId
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "employeeId is not valid" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // validate month & year
    if (!month || !year) {
      return res.status(400).json({
        message: "month and year are required",
      });
    }

    month = parseInt(month);
    year = parseInt(year);

    if (month < 1 || month > 12) {
      return res.status(400).json({
        message: "month must be between 1-12",
      });
    }

    // date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // query
    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: "employeeId",
        select: "name email", // fix here
      })
      .sort({ date: -1 });

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }
    if (!checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }

    if (!checkOutTime) {
      return res.status(400).json({ message: "Check-out time is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        checkInTime,
        checkOutTime,
        status,
      },
      { new: true },
    );
    res
      .status(200)
      .json({ message: "Attendance updated successfully", data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Attendance from "../model/attendace.Schema.js";
import mongoose from "mongoose";

// // create
// export const createAttendance = async (req, res) => {
//   try {
//     const {
//       employeeId,
//       date,
//       checkInTime,
//       checkOutTime,
//       hoursWorked,
//       status,
//       note,
//     } = req.body;
//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }
//     if (!date) {
//       return res.status(400).json({ message: "Date is required" });
//     }
//     if (!hoursWorked) {
//       return res.status(400).json({ message: "Hours worked is required" });
//     }
//     const attendance = await Attendance.create({
//       employeeId,
//       date,
//       checkInTime,
//       checkOutTime,
//       hoursWorked,
//       status,
//       note,
//     });
//     res.status(201).json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    if (!checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }
    if (new Date(date).toDateString() == new Date().toDateString()) {
      status = "present";
    } else if (new Date(date).toISOString() > new Date().toISOString()) {
      return res.status(400).json({ message: "Future date is not allowed" });
    } else {
      status = "absent";
    }

    const attendance = await Attendance.create({
      employeeId,
      date,
      checkInTime,
      status,
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// check out
export const checkOut = async (req, res) => {
  try {
    const { checkOutTime } = req.body;

    if (!checkOutTime) {
      return res.status(400).json({ message: "Check-out time is required" });
    }
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    if (record && !record.checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }
    function calculateWorkHours(checkInTime, checkOutTime) {
      const diffMs = new Date(checkOutTime) - new Date(checkInTime);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    }
    const hoursWorked = calculateWorkHours(record.checkInTime, checkOutTime);
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        checkOutTime,
        hoursWorked,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in check-out",
      error: error.message,
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
        path: "user",
        select: "name email department",
        populate: {
          path: "department",
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
    const userId = req.user.id;
    let { month, year } = req.query;
    const currentDate = new Date();
    month = month ? parseInt(month) : currentDate.getMonth() + 1;
    year = year ? parseInt(year) : currentDate.getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      user: userId,
      checkIn: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ checkIn: -1 });

    res.status(200).json({
      message: "Attendance fetched successfully",
      total: attendance.length,
      month,
      year,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};

// update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { checkInTime, checkOutTime, status } = req.body;

    if (!checkInTime) {
      return res.status(400).json({ message: "Check-in time is required" });
    }

    if (!checkOutTime) {
      return res.status(400).json({ message: "Check-out time is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
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
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

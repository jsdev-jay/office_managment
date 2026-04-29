import LeaveRequest from "../model/leaveRequest.Schema.js";
import mongoose from "mongoose";

//apply for leave
export const applyForLeave = async (req, res) => {
  try {
    const { employeeId, type, fromDate, toDate, reason, status } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }

    if (!fromDate) {
      return res.status(400).json({ message: "From date is required" });
    }
    if (!toDate) {
      return res.status(400).json({ message: "To date is required" });
    }
    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const leaveRequest = await LeaveRequest.create({
      type,
      fromDate,
      toDate,
      reason,
      employeeId,
      status,
    });
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all leave requests

export const getAllLeaveRequests = async (req, res) => {
  try {
    const { employeeId, status, type, month } = req.query;
    let filter = {};
    if (employeeId) {
      filter.employeeId = employeeId;
    }
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      filter.employeeId = employeeId;
    } else {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    if (status) {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }
    if (month) {
      const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1);
      const endOfMonth = new Date(new Date().getFullYear(), month, 0);
      filter.fromDate = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const leaveRequests = await LeaveRequest.find(filter);
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my leave request

export const getMyLeaveRequests = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let filter = {};
    if (employeeId) {
      filter.employeeId = employeeId;
    }
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      filter.employeeId = employeeId;
    } else {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    if (status) {
      filter.status = status;
    }
    const leaveRequests = await LeaveRequest.find(filter);
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single leave request

export const getSingleLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// approve leave request

export const approveLeaveRequest = async (req, res) => {
  try {
    const { reviewNote } = req.body;
    const { id } = req.params;
    if (!reviewNote) {
      return res.status(400).json({ message: "Review note is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Leave request ID is not valid" });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status: "approved", reviewNote },
      { new: true },
    );
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reject leave request

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;
    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status: "rejected", reason },
      { new: true },
    );
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// cancel leave request
export const cancelLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    leave.status = "pending";
    await leave.save();

    res.json({ message: "Leave pending", leave });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import mongoose from "mongoose";
import Department from "../model/department.Schema.js";
import auth from "../model/auth.Schema.js";
import { authRole } from "../constants/enum.js";

// create
export const createDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;
    if (!name || name.trim() == "") {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description || description.trim() == "") {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!managerId || managerId.trim() == "") {
      return res.status(400).json({ message: "Manager ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ message: "Manager ID is not valid" });
    }

    const [isValid, isAvialble] = await Promise.all([
      auth.findById(managerId).lean(),
      Department.findOne({ name: name.trim() }).lean(),
    ]);
    if (!isValid) {
      return res.status(404).json({ message: "Manager not found" });
    }
    if (isValid.role !== authRole.MANAGER) {
      return res.status(400).json({ message: "Manager is not valid" });
    }
    if (isAvialble) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      description,
      managerId,
    });
    res.status(201).json({
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate({
        path: "managerId",
        select: "name",
      })
      .lean();
    res.status(200).json({
      message: "Departments fetched successfully",
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get by id
export const getDepartmentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Department ID is not valid" });
    }
    const department = await Department.findById(req.params.id)
      .populate("managerId", "name email")
      .lean();
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
      message: "Department fetched successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Department ID is not valid" });
    }
    if (name) {
      if (name.trim() == "") {
        return res.status(400).json({ message: "Name is required" });
      }
      const isNameValid = await Department.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });
      if (isNameValid) {
        return res.status(400).json({ message: "Name is already exists" });
      }
    }

    if (description) {
      if (description.trim() == "") {
        return res.status(400).json({ message: "Description is required" });
      }
    }
    if (managerId) {
      if (!mongoose.Types.ObjectId.isValid(managerId)) {
        return res.status(400).json({ message: "Manager ID is not valid" });
      }
      const isvalid = await auth.findById(managerId);
      if (!isvalid) {
        return res.status(404).json({ message: "Manager not found" });
      }
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        managerId,
      },
      { new: true },
    ).lean();
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete
export const deleteDepartment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Department ID is not valid" });
    }
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully",
      data: { ...department },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

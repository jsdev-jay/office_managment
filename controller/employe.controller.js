import Employee from "../model/employe.Schema.js";
import mongoose from "mongoose";
import Department from "../model/department.Schema.js";
// create employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, departmentId, salary, joinDate, status } =
      req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }
    if (!salary) {
      return res.status(400).json({ message: "Salary is required" });
    }
    if (!joinDate) {
      return res.status(400).json({ message: "Join date is required" });
    }
    if (!departmentId) {
      return res.status(400).json({ message: "Department is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    const emailExists = await Employee.findOne({ email, phone });
    if (emailExists) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "DepartmentID is not valid" });
    }
    const isvalid = await Department.findById(departmentId);
    if (!isvalid) {
      return res.status(404).json({ message: "Department not found" });
    }

    const employee = await Employee.create({
      name,
      email,
      phone,
      departmentId,
      salary,
      joinDate,
      status,
    });
    res.status(201).json({message: "Employee created successfully", data: employee});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const { departmentId, role, status } = req.query;
    const filter = {};
    if (departmentId) {
      filter.departmentId = departmentId;
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ message: "Department ID is not valid" });
      }

      const isvalid = await Department.findById(departmentId);
      if (!isvalid) {
        return res.status(404).json({ message: "Department not found" });
      }
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.status = status;
    }
    const employees = await Employee.find(filter).populate("departmentId");
    if (!employees) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(200).json({message: "Employees fetched successfully", data: employees});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get employee by id
export const getEmployeeById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    const employee = await Employee.findById(req.params.id).populate(
      "departmentId",
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({message: "Employee fetched successfully", data: employee});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const { name, phone, role, departmentId, salary, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    if (name) {
      if (name.trim() == "") {
        return res.status(400).json({ message: "Name is required" });
      }
    }
    if (phone) {
      if (phone.trim() == "") {
        return res.status(400).json({ message: "Phone is required" });
      }
    }
    if (role) {
      if (role.trim() == "") {
        return res.status(400).json({ message: "Role is required" });
      }
    }
    if (departmentId) {
      if (departmentId.trim() == "") {
        return res.status(400).json({ message: "Department is required" });
      }
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Department ID is not valid" });
    }
    if (salary) {
      if (salary.trim() == "") {
        return res.status(400).json({ message: "Salary is required" });
      }
    }
    if (status) {
      if (status.trim() == "") {
        return res.status(400).json({ message: "Status is required" });
      }
    }
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Department ID is not valid" });
    }
    const isvalid = await Department.findById(departmentId);
    if (!isvalid) {
      return res.status(404).json({ message: "Department not found" });
    }

    employee.name = name || employee.name;
    employee.phone = phone || employee.phone;
    employee.role = role || employee.role;
    employee.departmentId = departmentId || employee.departmentId;
    employee.salary = salary || employee.salary;
    employee.status = status || employee.status;
    await employee.save();
    res.status(200).json({message: "Employee updated successfully", data: employee});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete employee
export const deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Employee ID is not valid" });
    }
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (employee.status === "active") {
      return res
        .status(400)
        .json({ message: "Can not allow to delete active employee" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

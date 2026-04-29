import Department from "../model/department.Schema.js";


// create
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const department = await Department.create({
      name,
      description,
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "managerId",
      select: "name",
    });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get by id
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "managerId",
      "name email",
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!managerId) {
      return res.status(400).json({ message: "Manager is required" });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        managerId,
      },
      { new: true },
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (department.status === "active") {
      return res
        .status(400)
        .json({ message: "Can not allow to delete active department" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

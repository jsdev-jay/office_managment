import Announcement from "../model/annoucement.Schema.js";
import Department from "../model/department.Schema.js";
import Employee from "../model/employe.Schema.js";
import mongoose from "mongoose";
// Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, body, targetDepartmentId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!body) {
      return res.status(400).json({ message: "Body is required" });
    }
    if (!targetDepartmentId) {
      return res.status(400).json({ message: "Target Department is required" });
    }
    if (
      targetDepartmentId !== null &&
      !mongoose.Types.ObjectId.isValid(targetDepartmentId)
    ) {
      return res
        .status(400)
        .json({ message: "Target Department is not valid" });
    }

    const announcement = await Announcement.create({
      title: title,
      body: body,
      targetDepartmentId: targetDepartmentId,
    });

    return res.status(201).json({
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating announcement",
      error: error.message,
    });
  }
};

// Get All Announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate(
      "createdBy",
      "name role",
    );
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "name role",
    );
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true },
    );
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

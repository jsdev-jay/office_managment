import express from "express";
import authMiddleware, { isAdmin } from "../middleware/auth.middleware.js";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controller/announcement.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Announcement management APIs
 */
/**
 * @swagger
 * /announcement:
 *   post:
 *     summary: Create Announcement (Admin only)
 *     description: Create a new announcement. If targetDepartmentId is not provided, it will be company-wide.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: Holiday Notice
 *               body:
 *                 type: string
 *                 example: Office will be closed on Monday
 *               targetDepartmentId:
 *                 type: string
 *                 nullable: true
 *                 example: 661f2a8b1234567890abcd12
 *               createdBy:
 *                 type: string
 *                 example: 661f2a8b1234567890abcd99
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin only
 */
router.post("/", authMiddleware, isAdmin, createAnnouncement);

/**
 * @swagger
 * /announcement:
 *   get:
 *     summary: Get all announcements
 *     description: |
 *       - Admin → gets all announcements
 *       - Employee → gets only:
 *         • Their department announcements
 *         • Company-wide announcements (targetDepartment = null)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 */
router.get("/", authMiddleware, getAllAnnouncements);

/**
 * @swagger
 * /announcement/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement fetched successfully
 *       404:
 *         description: Announcement not found
 */
router.get("/:id", authMiddleware, getAnnouncementById);

/**
 * @swagger
 * /announcement/{id}:
 *   put:
 *     summary: Update announcement (Admin only)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               body:
 *                 type: string
 *                 example: Updated body content
 *               targetDepartment:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       403:
 *         description: Admin only
 */
router.put("/:id", authMiddleware, isAdmin, updateAnnouncement);

/**
 * @swagger
 * /announcement/{id}:
 *   delete:
 *     summary: Delete announcement (Admin only)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       403:
 *         description: Admin only
 */
router.delete("/:id", authMiddleware, isAdmin, deleteAnnouncement);

export default router;

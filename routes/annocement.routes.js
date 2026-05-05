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
 *         • Company-wide announcements (targetDepartmentId = null)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: targetDepartmentId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter announcements by target department ID
 *         example: "66301c2b8a1234567890abcd"
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             example:
 *               message: Announcements fetched successfully
 *               data:
 *                 - _id: "66301c2b8a1234567890abcd"
 *                   title: "Meeting Update"
 *                   description: "Team meeting at 4 PM"
 *                   targetDepartmentId: "66301c2b8a1234567890dcba"
 *                   createdAt: "2026-05-01T10:00:00.000Z"
 *                 - _id: "66301c2b8a1234567890abce"
 *                   title: "Holiday Notice"
 *                   description: "Office closed tomorrow"
 *                   targetDepartmentId: null
 *                   createdAt: "2026-05-02T10:00:00.000Z"
 *       400:
 *         description: Invalid department ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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

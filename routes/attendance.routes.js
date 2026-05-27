import express from "express";
import {
  checkIn,
  checkOut,
  // createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
} from "../controller/attendace.controller.js";
import authMiddleware, {
  isAdmin,
  isManagerOrAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       required:
 *         - employeeId
 *         - date
 *       properties:
 *         employeeId:
 *           type: string
 *           example: 661f1c2b8f1a2b3c4d5e6f70
 *         date:
 *           type: string
 *           format: date
 *           example: 2026-04-23
 *         checkInTime:
 *           type: string
 *           example: "09:30"
 *         checkOutTime:
 *           type: string
 *           example: "18:00"
 *         hoursWorked:
 *           type: number
 *           example: 8.5
 *         status:
 *           type: string
 *           example: "Present"
 *         note:
 *           type: string
 *           example: "Worked on backend"
 *
 */

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management APIs
 */

// /**
//  * @swagger
//  * /attendance:
//  *   post:
//  *     summary: Create attendance (check-in)
//  *     tags: [Attendance]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - employeeId
//  *               - date
//  *               - checkInTime
//  *               - status
//  *             properties:
//  *               employeeId:
//  *                 type: string
//  *               date:
//  *                 type: string
//  *                 format: date
//  *               checkInTime:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *               note:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Attendance created
//  */
// router.post("/", authMiddleware, isManagerOrAdmin, createAttendance);

/**
 * @swagger
 * /attendance/checkin:
 *   post:
 *     summary: Check-in employee
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - date
 *               - checkInTime
 *             properties:
 *               employeeId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               checkInTime:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Check-in successful
 */
router.post("/checkin", authMiddleware, isManagerOrAdmin, checkIn);

/**
 * @swagger
 * /attendance/checkout/{id}:
 *   post:
 *     summary: Check-out employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - date
 *               - checkOutTime
 *             properties:
 *               employeeId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               checkOutTime:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       200:
 *         description: Check-out successful
 */
router.post("/checkout/:id", authMiddleware, isManagerOrAdmin, checkOut);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendance (with filters)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: 2026-04
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance list
 */
router.get("/", authMiddleware, isManagerOrAdmin, getAllAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance details
 */
router.get("/:id", authMiddleware, isManagerOrAdmin, getAttendanceById);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update attendance (Admin only)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance updated
 */
router.put("/:id", authMiddleware, isAdmin, updateAttendance);

export default router;

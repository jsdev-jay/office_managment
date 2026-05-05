import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
} from "../controller/attendace.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { isManagerOrAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance Management APIs
 */

/**
 * @swagger
 * /attendance/checkin:
 *   post:
 *     summary: Employee check-in
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "66301c2b8a1234567890abcd"
 *               date:
 *                 type: string
 *                 example: "2026-05-05"
 *               checkInTime:
 *                 type: string
 *                 example: "09:30"
 *     responses:
 *       201:
 *         description: Attendancecreated
 *       400:
 *         description: Validation error
 */
router.post("/checkin", authMiddleware, checkIn);

/**
 * @swagger
 * /attendance/checkout:
 *   post:
 *     summary: Employee check-out
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             employeeId: "66301c2b8a1234567890abcd"
 *             date: "2026-05-05"
 *             checkOutTime: "18:30"
 *     responses:
 *       200:
 *         description: Checkout successful
 *       400:
 *         description: Validation error
 */
router.post("/checkout", checkOut);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         example: "66301c2b8a1234567890abcd"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         example: "2026-05-05"
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *         example: 5
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         example: 2026
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 */
router.get("/", getAllAttendance);

/**
 * @swagger
 * /attendance/:
 *   get:
 *     summary: Get attendance by employeeId, month & year
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "66301c2b8a1234567890abcd"
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         example: 5
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         example: 2026
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 */
router.get("/", getAttendanceById);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update attendance
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "66301c2b8a1234567890abcd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             checkInTime: "09:30"
 *             checkOutTime: "18:30"
 *             status: "present"
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 */
router.put("/:id", updateAttendance);

export default router;

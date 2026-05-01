import express from "express";
import {
  checkIn,
  checkOut,
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
 * /attendance/checkout:
 *   post:
 *     summary: Employee check-out
 *     description: Marks check-out for an employee and calculates working hours.
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
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "662f1c2b8a1234567890abcd"
 *               checkOutTime:
 *                 type: string
 *                 example: "18:15"
 *               date:
 *                 type: string
 *                 example: "01-05-2026"
 *     responses:
 *       200:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Checkout successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: string
 *                       example: "662f1c2b8a1234567890abcd"
 *                     checkOutTime:
 *                       type: string
 *                       example: "18:15"
 *                     date:
 *                       type: string
 *                       example: "01-05-2026"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: employeeId is required
 *       404:
 *         description: Check-in not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Check-in not found for today
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */
router.post("/checkout", authMiddleware, checkOut);

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
 *     summary: Get attendance by employeeId, month and year
 *     description: Fetch attendance records for a specific employee filtered by month and year.
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
 *               - month
 *               - year
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "662f1c2b8a1234567890abcd"
 *               month:
 *                 type: integer
 *                 example: 5
 *                 description: Month number (1-12)
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance fetched successfully
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 month:
 *                   type: integer
 *                   example: 5
 *                 year:
 *                   type: integer
 *                   example: 2026
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66301c2b8a1234567890abcd"
 *                       date:
 *                         type: string
 *                         example: "2026-05-01T00:00:00.000Z"
 *                       checkInTime:
 *                         type: string
 *                         example: "09:30"
 *                       checkOutTime:
 *                         type: string
 *                         example: "18:15"
 *                       workingHours:
 *                         type: string
 *                         example: "8h 45m"
 *                       employeeId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "662f1c2b8a1234567890abcd"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *       401:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missingEmployeeId:
 *                 value:
 *                   message: employeeId is required
 *               invalidEmployeeId:
 *                 value:
 *                   message: employeeId is not valid
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missingEmployeeId:
 *                 value:
 *                   message: employeeId is required
 *               invalidEmployeeId:
 *                 value:
 *                   message: employeeId is not valid
 *               missingMonthYear:
 *                 value:
 *                   message: month and year are required
 *               invalidMonth:
 *                 value:
 *                   message: month must be between 1-12
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             example:
 *               message: Employee not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Error fetching attendance
 *               error: Internal server error
 */
router.get("/:id", authMiddleware, getAttendanceById);

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
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkInTime
 *               - checkOutTime
 *               - status
 *             properties:
 *               checkInTime:
 *                 type: string
 *                 example: "09:30"
 *                 description: Check-in time in HH:mm format
 *               checkOutTime:
 *                 type: string
 *                 example: "18:00"
 *                 description: Check-out time in HH:mm format
 *               status:
 *                 type: string
 *                 example: "present"
 *                 description: Attendance status (e.g. present, absent)
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missingCheckIn:
 *                 value:
 *                   message: Check-in time is required
 *               missingCheckOut:
 *                 value:
 *                   message: Check-out time is required
 *               missingStatus:
 *                 value:
 *                   message: Status is required
 *       404:
 *         description: Attendance not found
 *         content:
 *           application/json:
 *             example:
 *               message: Attendance not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.put("/:id", authMiddleware, isAdmin, updateAttendance);

export default router;

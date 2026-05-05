import express from "express";
import {
  applyForLeave,
  getAllLeaveRequests,
  getMyLeaveRequests,
  getSingleLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
} from "../controller/leaveRequest.controller.js";
import authMiddleware, {
  isManagerOrAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LeaveRequest:
 *       type: object
 *       required:
 *         - employeeId
 *         - fromDate
 *         - toDate
 *         - reason
 *       properties:
 *         _id:
 *           type: string
 *           example: 661f1c2b8f1a2b3c4d5e6f70
 *         employeeId:
 *           type: string
 *           example: 661f1c2b8f1a2b3c4d5e6f71
 *         type:
 *           type: string
 *           enum: [sick, casual, unpaid]
 *           example: sick
 *         fromDate:
 *           type: string
 *           format: date
 *           example: 2026-04-25
 *         toDate:
 *           type: string
 *           format: date
 *           example: 2026-04-27
 *         reason:
 *           type: string
 *           example: Fever and flu
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, canceled]
 *           example: pending
 *
 *     LeaveRequestInput:
 *       type: object
 *       required:
 *         - employeeId
 *         - fromDate
 *         - toDate
 *         - reason
 *       properties:
 *         employeeId:
 *           type: string
 *           example: 661f1c2b8f1a2b3c4d5e6f71
 *         type:
 *           type: string
 *           enum: [sick, casual, unpaid]
 *           example: casual
 *         fromDate:
 *           type: string
 *           format: date
 *           example: 2026-04-25
 *         toDate:
 *           type: string
 *           format: date
 *           example: 2026-04-27
 *         reason:
 *           type: string
 *           example: Family function
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 */

/**
 * @swagger
 * tags:
 *   name: LeaveRequests
 *   description: Leave request management APIs
 */

/**
 * @swagger
 * /leave:
 *   post:
 *     summary: Apply for a leave (Manager or Admin)
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaveRequestInput'
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, applyForLeave);

/**
 * @swagger
 * /leave:
 *   get:
 *     summary: Get all leave requests
 *     description: |
 *       Fetch leave requests with multiple filters.
 *
 *       You can combine filters:
 *       - employeeId → specific employee leaves
 *       - status → pending / approved / rejected
 *       - type → leave type (sick, casual, paid, etc.)
 *       - month → filter leaves by month (current year by default)
 *
 *       Notes:
 *       - Month is 1-based (1 = January, 12 = December)
 *       - Filters can be combined
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by employee ID
 *         example: "66301c2b8a1234567890abcd"
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         required: false
 *         description: Filter by leave status
 *         example: "approved"
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by leave type
 *         example: "sick"
 *
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         required: false
 *         description: Filter by month (1-12, current year assumed)
 *         example: 5
 *
 *     responses:
 *       200:
 *         description: Leave requests fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Leave requests fetched successfully
 *               data:
 *                 - _id: "66301c2b8a1234567890aaaa"
 *                   employeeId: "66301c2b8a1234567890abcd"
 *                   type: "sick"
 *                   status: "approved"
 *                   fromDate: "2026-05-01T00:00:00.000Z"
 *                   toDate: "2026-05-03T00:00:00.000Z"
 *                   reason: "Fever"
 *                   createdAt: "2026-04-28T10:00:00.000Z"
 *
 *       400:
 *         description: Invalid employee ID
 *         content:
 *           application/json:
 *             example:
 *               message: Employee ID is not valid
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, isManagerOrAdmin, getAllLeaveRequests);
/**
 * @swagger
 * /leave/my:
 *   get:
 *     summary: Get my own leave requests (with optional filters)
 *     security:
 *       - BearerAuth: []
 *     tags: [LeaveRequests]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, canceled]
 *         description: Filter by leave status
 *     responses:
 *       200:
 *         description: List of personal leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 *       500:
 *         description: Internal server error
 */
router.get("/my", authMiddleware, getMyLeaveRequests);

/**
 * @swagger
 * /leave/{id}:
 *   get:
 *     summary: Get a single leave request by ID
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     responses:
 *       200:
 *         description: Leave request details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, getSingleLeaveRequest);

/**
 * @swagger
 * /leave/{id}/approve:
 *   put:
 *     summary: Approve a leave request (Manager or Admin)
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewNote:
 *                 type: string
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Leave request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id/approve",
  authMiddleware,
  isManagerOrAdmin,
  approveLeaveRequest,
);

/**
 * @swagger
 * /leave/{id}/reject:
 *   put:
 *     summary: Reject a leave request (Manager or Admin)
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Rejected due to workload
 *     responses:
 *       200:
 *         description: Leave request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/reject", authMiddleware, isManagerOrAdmin, rejectLeaveRequest);

/**
 * @swagger
 * /leave/{id}/cancel:
 *   put:
 *     summary: Cancel a leave request (Manager or Admin)
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     responses:
 *       200:
 *         description: Leave request canceled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/cancel", authMiddleware, cancelLeaveRequest);

export default router;

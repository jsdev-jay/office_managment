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
router.post("/", authMiddleware, isManagerOrAdmin, applyForLeave);

/**
 * @swagger
 * /leave:
 *   get:
 *     summary: Get all leave requests (Manager or Admin, with optional filters)
 *     tags: [LeaveRequests]
 *     security:
 *       - BearerAuth: []
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
 *         description: List of leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, isManagerOrAdmin, getAllLeaveRequests);

/**
 * @swagger
 * /leave/my:
 *   get:
 *     summary: Get my own leave requests (with optional filters)
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
router.get("/my", getMyLeaveRequests);

/**
 * @swagger
 * /leave/{id}:
 *   get:
 *     summary: Get a single leave request by ID
 *     tags: [LeaveRequests]
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
router.get("/:id", getSingleLeaveRequest);

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
router.put("/:id/cancel", authMiddleware, isManagerOrAdmin, cancelLeaveRequest);

export default router;

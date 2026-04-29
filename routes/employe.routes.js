import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controller/employe.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { isAdmin, isManagerOrAdmin } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           example: 66123abc123abc123abc1234
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: "9876543210"
 *         role:
 *           type: string
 *           example: Developer
 *         designation:
 *           type: string
 *           example: Developer
 *         departmentId:
 *           type: string
 *           example: 66123abc123abc123abc1234
 *         salary:
 *           type: number
 *           example: 50000
 *         joinDate:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *
 *     EmployeeInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: jay patel
 *         email:
 *           type: string
 *           example: jay@gmail.com
 *         phone:
 *           type: string
 *           example: "9876543210"
 *         role:
 *           type: string
 *           example: "Developer"
 *         departmentId:
 *           type: string
 *           example: "64f123abc123"
 *         salary:
 *           type: number
 *           example: 50000
 *         joinDate:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 */
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */
router.post("/", authMiddleware, isAdmin, createEmployee);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees (Manager or Admin)
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
router.get("/", authMiddleware, isManagerOrAdmin, getAllEmployees);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */
router.get("/:id", getEmployeeById);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 */
router.put("/:id", authMiddleware, isAdmin, updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee (Admin only)
 *     description: |
 *       Deletes an employee by ID.
 *       Cannot delete if employee status is "active".
 *     tags: [Employees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *           example: 661f2a8b1234567890abcd12
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Employee deleted successfully
 *
 *       400:
 *         description: Cannot delete active employee
 *         content:
 *           application/json:
 *             example:
 *               message: Can not allow to delete active employee
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             example:
 *               message: Employee not found
 *
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *
 *       500:
 *         description: Server error
 */

router.delete("/:id", authMiddleware, isAdmin, deleteEmployee);

export default router;

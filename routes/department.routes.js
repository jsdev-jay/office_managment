import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controller/department.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { isAdmin, isManagerOrAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department management APIs
 */

/**
 * @swagger
 * /departments/create:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - managerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: IT Department
 *               description:
 *                 type: string
 *                 example: Handles all technical tasks
 *               managerId:
 *                 type: string
 *                 example: 69f0476dc5f3759f0c7c50a3
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/create", authMiddleware, isAdmin, createDepartment);

/**
 * @swagger
 * /departments/getAll:
 *   get:
 *     summary: Get all departments
 *
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all departments
 *       500:
 *         description: Server error
 */
router.get("/getAll", authMiddleware, getAllDepartments);

/**
 * @swagger
 * /departments/getById/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 69f0476dc5f3759f0c7c50a3
 *     responses:
 *       200:
 *         description: Department found
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.get("/getById/:id", authMiddleware, getDepartmentById);

/**
 * @swagger
 * /departments/update/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 69f0476dc5f3759f0c7c50a3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: HR Department
 *               description:
 *                 type: string
 *                 example: Handles recruitment
 *               managerId:
 *                 type: string
 *                 example: 661f2b1234567890abcdef99
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Validation error / Only admin can update
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.put("/update/:id", authMiddleware, isAdmin, updateDepartment);

/**
 * @swagger
 * /departments/delete/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *           example: 661f2b1234567890abcdef12
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       400:
 *         description: Cannot delete active department
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", authMiddleware, isAdmin, deleteDepartment);

export default router;

import express from "express";
import { body } from "express-validator";

import {
  getAllComplaints,
  getAdminComplaintById,
  updateComplaintStatus,getAdminDashboard
} from "../controllers/adminController.js";
import {
  validateRequest,
} from "../middleware/validationMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getAdminDashboard);

router.get("/complaints", getAllComplaints);

router.get(
  "/complaints/:id",
  getAdminComplaintById
);

router.put(
  "/complaints/:id/status",  [
    body("status")
      .optional()
      .isIn([
        "submitted",
        "in-progress",
        "resolved",
        "closed",
      ])
      .withMessage("Invalid complaint status"),

    body("adminRemarks")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage(
        "Admin remarks cannot exceed 1000 characters"
      ),
  ],

  validateRequest,
  updateComplaintStatus
);

export default router;
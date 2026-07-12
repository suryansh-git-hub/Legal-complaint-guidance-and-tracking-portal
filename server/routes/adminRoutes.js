import express from "express";
import { body } from "express-validator";

import {
  getAllComplaints,
  getAdminComplaintById,
  updateComplaintStatus,getAdminDashboard,assessComplaint,createDocumentRequest
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
  "/complaints/:id/assessment",
  [
    body("assessment")
      .notEmpty()
      .withMessage("Assessment is required")
      .isIn([
        "actionable",
        "needs-information",
        "not-actionable",
      ])
      .withMessage("Invalid assessment"),

    body("adminRemarks")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage(
        "Admin remarks cannot exceed 1000 characters"
      ),
  ],
  validateRequest,
  assessComplaint
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
router.post(
  "/complaints/:id/document-requests",
  [
    body("documentName")
      .trim()
      .notEmpty()
      .withMessage("Document name is required")
      .isLength({ max: 150 })
      .withMessage(
        "Document name cannot exceed 150 characters"
      ),

    body("instructions")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage(
        "Instructions cannot exceed 1000 characters"
      ),
  ],
  validateRequest,
  createDocumentRequest
);

export default router;
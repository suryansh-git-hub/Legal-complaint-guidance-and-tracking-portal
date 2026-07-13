import express from "express";
import { body } from "express-validator";

import { createComplaint,getComplaints,getComplaintById,
  updateComplaint,deleteComplaint,
  getComplaintStats,uploadRequestedDocument,submitComplaintFeedback
} from "../controllers/complaintController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  validateRequest,
} from "../middleware/validationMiddleware.js";

import {
  uploadComplaintDocuments,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

/* ==============================
   Complaint Statistics
================================ */

router.get("/stats", getComplaintStats);

/* ==============================
   Create Complaint
   Get User Complaints
================================ */

router
  .route("/")
  .post(
    uploadComplaintDocuments.array(
      "documents",
      5
    ),
    createComplaint
  )
  .get(getComplaints);

/* ==============================
   Single Complaint Routes
================================ */
router.post(
  "/:id/document-requests/:requestId/upload",
  uploadComplaintDocuments.single("document"),
  uploadRequestedDocument
); 

router.post(
  "/:id/feedback",
  [
    body("satisfied")
      .isBoolean()
      .withMessage(
        "Satisfied value must be true or false"
      ),

    body("feedbackComment")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage(
        "Feedback comment cannot exceed 1000 characters"
      ),
  ],
  validateRequest,
  submitComplaintFeedback
);

router
  .route("/:id")

  .get(getComplaintById)

  .put(
    [
      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 150 })
        .withMessage(
          "Title cannot exceed 150 characters"
        ),

      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "Description cannot be empty"
        )
        .isLength({ max: 2000 })
        .withMessage(
          "Description cannot exceed 2000 characters"
        ),

      body("notes")
        .optional()
        .isArray()
        .withMessage("Notes must be an array"),
    ],

    validateRequest,
    updateComplaint
  )

  .delete(deleteComplaint);

export default router;
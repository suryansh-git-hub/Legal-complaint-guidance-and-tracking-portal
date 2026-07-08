import express from "express";

import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,getComplaintStats,
} from "../controllers/complaintController.js";

import { protect} from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import {
  validateRequest,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getComplaintStats);

router.route("/").post(createComplaint).get(getComplaints);

router
  .route("/:id")
  .get(getComplaintById)

  .put(   [
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

    validateRequest,updateComplaint)
  .delete(deleteComplaint);



export default router;
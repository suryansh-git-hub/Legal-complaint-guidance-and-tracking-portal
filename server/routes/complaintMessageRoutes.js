import express from "express";
import { body } from "express-validator";

import {
  getComplaintMessages,
  sendComplaintMessage,
} from "../controllers/complaintMessageController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  validateRequest,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/:complaintId/messages",
  getComplaintMessages
);

router.post(
  "/:complaintId/messages",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 2000 })
      .withMessage(
        "Message cannot exceed 2000 characters"
      ),
  ],
  validateRequest,
  sendComplaintMessage
);

export default router;
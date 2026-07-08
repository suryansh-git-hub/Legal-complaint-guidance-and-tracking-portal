import express from "express";
import { body } from "express-validator";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  validateRequest,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",

  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage(
        "Name must be between 2 and 50 characters"
      ),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must contain at least 6 characters"
      ),
  ],

  validateRequest,

  registerUser
);

router.post(
  "/login",

  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],

  validateRequest,

  loginUser
);

router.post("/logout", logoutUser);

router.get("/profile", protect, getUserProfile);

export default router;
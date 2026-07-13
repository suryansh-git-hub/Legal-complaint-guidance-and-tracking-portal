import express from "express";
import { body } from "express-validator";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,forgotPassword,
  resetPassword,
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

router.post(
  "/forgot-password",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email")
      .normalizeEmail(),
  ],
  validateRequest,
  forgotPassword
);

router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage(
        "Password must contain at least 8 characters"
      ),
  ],
  validateRequest,
  resetPassword
);

export default router;
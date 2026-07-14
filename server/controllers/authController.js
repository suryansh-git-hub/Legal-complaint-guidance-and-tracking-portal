import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

   // generateToken(res, user._id);

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
          role: user.role,

      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");;

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT and store in HTTP-only cookie
    generateToken(res, user._id);

    return res.status(200).json({
      message: "User logged in successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
         role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      expires: new Date(0),
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    /*
      Always return the same response whether the user
      exists or not.

      This prevents attackers from checking which email
      addresses are registered.
    */

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate random reset token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token before saving it in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailHtml = `
      <h2>Reset Your NyayaPath Password</h2>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the link below to create a new password:
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
        This link will expire in 15 minutes.
      </p>

      <p>
        If you did not request a password reset,
        you can ignore this email.
      </p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "NyayaPath Password Reset",
        html: emailHtml,
      });

      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    } catch (emailError) {
      /*
        Email failed, so remove token from database.
      */
 console.error("EMAIL ERROR:", emailError);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      return res.status(500).json({
        message: "Failed to send reset email",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token
    // and make sure token has not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Password reset link is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      password,
      salt
    );

    // Remove reset token after successful use
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export { registerUser,loginUser,logoutUser,getUserProfile,  forgotPassword,
  resetPassword,};
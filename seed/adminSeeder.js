import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required"
      );
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      existingAdmin.role = "admin";

      await existingAdmin.save();

      console.log("Existing user promoted to admin");
    } else {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(
        adminPassword,
        salt
      );

      await User.create({
        name: "NyayaPath Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin created successfully");
    }

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedAdmin();
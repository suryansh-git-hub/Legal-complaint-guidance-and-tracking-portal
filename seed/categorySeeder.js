import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import categoryData from "./categoryData.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany();

    await Category.insertMany(categoryData);

    console.log("Categories seeded successfully");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Category seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedCategories();
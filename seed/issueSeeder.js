import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Issue from "../models/Issue.js";
import issueData from "./issueData.js";

dotenv.config();

const seedIssues = async () => {
  try {
    await connectDB();

    // Delete existing issues
    await Issue.deleteMany();

    const issuesWithCategoryIds = [];

    for (const issue of issueData) {
      const category = await Category.findOne({
        name: issue.categoryName,
      });

      if (!category) {
        throw new Error(
          `Category not found: ${issue.categoryName}`
        );
      }

      issuesWithCategoryIds.push({
        title: issue.title,
        description: issue.description,
        category: category._id,
        immediateSteps: issue.immediateSteps,
        requiredDocuments: issue.requiredDocuments,
        complaintSteps: issue.complaintSteps,
        officialResources: issue.officialResources,
      });
    }

    await Issue.insertMany(issuesWithCategoryIds);

    console.log("Issues seeded successfully");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Issue seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedIssues();
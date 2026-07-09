import express from "express";

import {
  getIssues,
  getIssueById,
  getIssuesByCategory,
} from "../controllers/issueController.js";

const router = express.Router();

router.get("/", getIssues);

router.get("/category/:categoryId", getIssuesByCategory);

router.get("/:id", getIssueById);

export default router;
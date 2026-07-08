import express from "express";

import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,getComplaintStats
} from "../controllers/complaintController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getComplaintStats);

router.route("/").post(createComplaint).get(getComplaints);

router
  .route("/:id")
  .get(getComplaintById)
  .put(updateComplaint)
  .delete(deleteComplaint);



export default router;
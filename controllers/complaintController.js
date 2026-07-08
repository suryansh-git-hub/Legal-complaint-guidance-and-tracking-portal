import mongoose from "mongoose";

import Complaint from "../models/Complaint.js";
import Issue from "../models/Issue.js";

const createComplaint = async (req, res) => {
  try {
    const { issue, title, description, notes } = req.body;

    if (!issue || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Issue, title and description are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(issue)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const existingIssue = await Issue.findById(issue);

    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      issue,
      title,
      description,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint tracking record created successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id,
    })
      .populate({
        path: "issue",
        select: "title category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findOne({
      _id: id,
      user: req.user._id,
    }).populate({
      path: "issue",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const { title, description, status, notes } = req.body;

    if (title !== undefined) {
      complaint.title = title;
    }

    if (description !== undefined) {
      complaint.description = description;
    }

    if (status !== undefined) {
      complaint.status = status;
    }

    if (notes !== undefined) {
      complaint.notes = notes;
    }

    const updatedComplaint = await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

  const getComplaintStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalComplaints,
      draftComplaints,
      submittedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({
        user: userId,
      }),

      Complaint.countDocuments({
        user: userId,
        status: "draft",
      }),

      Complaint.countDocuments({
        user: userId,
        status: "submitted",
      }),

      Complaint.countDocuments({
        user: userId,
        status: "in-progress",
      }),

      Complaint.countDocuments({
        user: userId,
        status: "resolved",
      }),

      Complaint.countDocuments({
        user: userId,
        status: "closed",
      }),

      Complaint.find({
        user: userId,
      })
        .populate({
          path: "issue",
          select: "title category",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        total: totalComplaints,
        draft: draftComplaints,
        submitted: submittedComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        closed: closedComplaints,
      },

      recentComplaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
};
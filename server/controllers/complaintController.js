import mongoose from "mongoose";

import Complaint from "../models/Complaint.js";
import Issue from "../models/Issue.js";
import fs from "fs/promises";

import ComplaintDocument from "../models/ComplaintDocument.js";
import DocumentRequest from "../models/DocumentRequest.js";

const createComplaint = async (req, res, next) => {
  let complaint = null;

  try {
    const { issue, title, description, notes } = req.body;

    if (!issue || !title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Issue, title and description are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(issue)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    complaint = await Complaint.create({
      user: req.user._id,
      issue,
      title,
      description,
      notes,
    });

    let documents = [];

    if (req.files && req.files.length > 0) {
      const documentData = req.files.map((file) => ({
          complaint: complaint._id,
  uploadedBy: req.user._id,
  documentRequest: null,
  documentType: "initial",

  originalName: file.originalname,
  fileName: file.filename,
  filePath: file.path,

  fileUrl: `/uploads/complaints/${file.filename}`,

  mimeType: file.mimetype,
  fileSize: file.size,
      }));

      documents =
        await ComplaintDocument.insertMany(
          documentData
        );
    }

    const populatedComplaint =
      await Complaint.findById(complaint._id)
        .populate("issue")
        .populate("user", "name email");

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint: populatedComplaint,
      documents,
    });
  } catch (error) {
    /*
      If ComplaintDocument creation fails after the
      complaint was created, remove the complaint.
    */

    if (complaint) {
      await Complaint.findByIdAndDelete(
        complaint._id
      ).catch(() => {});
    }

    /*
      Remove uploaded files if complaint creation
      or document saving fails.
    */

    if (req.files?.length > 0) {
      await Promise.all(
        req.files.map((file) =>
          fs.unlink(file.path).catch(() => {})
        )
      );
    }

    next(error);
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

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("issue")
      .populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const documents = await ComplaintDocument.find({
      complaint: complaint._id,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

      const documentRequests = await DocumentRequest.find({
  complaint: complaint._id,
})
  .populate("requestedBy", "name email")
  .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      complaint,
      documents,
        documentRequests,
    });
  } catch (error) {
    next(error);
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

    const { title, description,  notes } = req.body;

    if (title !== undefined) {
      complaint.title = title;
    }

    if (description !== undefined) {
      complaint.description = description;
    }

    // if (status !== undefined) {
    //   complaint.status = status;
    // }

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

const uploadRequestedDocument = async (
  req,
  res,
  next
) => {
  try {
    const { id, requestId } = req.params;

    // Check IDs
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(requestId)
    ) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(400).json({
        success: false,
        message: "Invalid complaint or document request ID",
      });
    }

    // Make sure complaint belongs to logged-in user
    const complaint = await Complaint.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!complaint) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Find request belonging to this complaint
    const documentRequest =
      await DocumentRequest.findOne({
        _id: requestId,
        complaint: complaint._id,
      });

    if (!documentRequest) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(404).json({
        success: false,
        message: "Document request not found",
      });
    }

    // Only pending requests can receive uploads
    if (documentRequest.status !== "pending") {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(400).json({
        success: false,
        message:
          "This document request has already been submitted",
      });
    }

    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document",
      });
    }

    // Create document record
    const complaintDocument =
      await ComplaintDocument.create({
        complaint: complaint._id,
        uploadedBy: req.user._id,

        documentRequest: documentRequest._id,
        documentType: "requested",

        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,

        fileUrl: `/uploads/complaints/${req.file.filename}`,

        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });

    // Update request status
    documentRequest.status = "submitted";
    documentRequest.submittedAt = new Date();

    await documentRequest.save();

    const populatedDocument =
      await ComplaintDocument.findById(
        complaintDocument._id
      )
        .populate("uploadedBy", "name email")
        .populate(
          "documentRequest",
          "documentName instructions status"
        );

    return res.status(201).json({
      success: true,
      message:
        "Requested document uploaded successfully",
      document: populatedDocument,
      documentRequest,
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    next(error);
  }
};
const submitComplaintFeedback = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { satisfied, feedbackComment } = req.body;

    // Validate complaint ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    // Make sure complaint belongs to logged-in user
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

    // Feedback can only be submitted for resolved complaints
    if (complaint.status !== "resolved") {
      return res.status(400).json({
        success: false,
        message:
          "Feedback can only be submitted for resolved complaints",
      });
    }

    // Make sure satisfied is actually a boolean
    if (typeof satisfied !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "Satisfied value must be true or false",
      });
    }

    // Prevent multiple feedback submissions
    // until admin revises the resolution
    if (complaint.satisfied !== null) {
      return res.status(400).json({
        success: false,
        message:
          "Feedback has already been submitted",
      });
    }

    complaint.satisfied = satisfied;
    complaint.feedbackComment =
      feedbackComment?.trim() || "";

    complaint.feedbackSubmittedAt = new Date();

    // Satisfied user → close complaint
    if (satisfied === true) {
      complaint.status = "closed";
    }

    // Unsatisfied user → complaint remains resolved

    await complaint.save();

    return res.status(200).json({
      success: true,
      message:
        satisfied === true
          ? "Feedback submitted and complaint closed successfully"
          : "Feedback submitted successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

export { createComplaint, getComplaints,getComplaintById, updateComplaint, deleteComplaint, getComplaintStats,uploadRequestedDocument,submitComplaintFeedback };
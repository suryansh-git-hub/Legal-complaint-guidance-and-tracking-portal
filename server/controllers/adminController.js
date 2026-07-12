import mongoose from "mongoose";

import Complaint from "../models/Complaint.js";
import ComplaintDocument from "../models/ComplaintDocument.js";
import DocumentRequest from "../models/DocumentRequest.js";

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate({
        path: "issue",
        select: "title category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate("reviewedBy", "name email")
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

// const getAdminComplaintById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid complaint ID",
//       });
//     }

//     const complaint = await Complaint.findById(id)
//       .populate("user", "name email")
//       .populate({
//         path: "issue",
//         populate: {
//           path: "category",
//           select: "name",
//         },
//       })
//       .populate("reviewedBy", "name email");

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: "Complaint not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       complaint,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// const updateComplaintStatus = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { status, adminRemarks } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid complaint ID",
//       });
//     }

//     const allowedStatuses = [
//       "submitted",
//       "in-progress",
//       "resolved",
//       "closed",
//     ];

//     if (status && !allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid complaint status",
//       });
//     }

//     const complaint = await Complaint.findById(id);

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: "Complaint not found",
//       });
//     }

//     if (status !== undefined) {
//       complaint.status = status;
//     }

//     if (adminRemarks !== undefined) {
//       complaint.adminRemarks = adminRemarks;
//     }

//     complaint.reviewedBy = req.user._id;

//     const updatedComplaint = await complaint.save();

//     return res.status(200).json({
//       success: true,
//       message: "Complaint updated successfully",
//       complaint: updatedComplaint,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
  

const getAdminComplaintById = async (
  req,
  res,
  next
) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    )
      .populate("user", "name email")
      .populate("issue");

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
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // const validTransitions = {
    //   submitted: ["in-progress"],
    //   "in-progress": ["resolved"],
    //   resolved: ["closed"],
    //   closed: [],
    // };

    const validTransitions = {
  submitted: [],
  "under-review": [],
  "needs-information": ["under-review"],
  "in-progress": ["resolved"],
  resolved: ["closed"],
  closed: [],
};

    if (
      status &&
      status !== complaint.status &&
      !validTransitions[complaint.status]?.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change complaint status from ${complaint.status} to ${status}`,
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (adminRemarks !== undefined) {
      complaint.adminRemarks = adminRemarks;
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
    });
  }
};
  const getAdminDashboard = async (req, res) => {
  try {
    const [
      total,
      draft,
      submitted,
      inProgress,
      resolved,
      closed,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "draft",
      }),

      Complaint.countDocuments({
        status: "submitted",
      }),

      Complaint.countDocuments({
        status: "in-progress",
      }),

      Complaint.countDocuments({
        status: "resolved",
      }),

      Complaint.countDocuments({
        status: "closed",
      }),

      Complaint.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email"),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        total,
        draft,
        submitted,
        inProgress,
        resolved,
        closed,
      },

      recentComplaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};

const assessComplaint = async (req, res, next) => {
  try {
    const { assessment, adminRemarks } = req.body;

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.assessment !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Complaint has already been assessed",
      });
    }

    const allowedAssessments = [
      "actionable",
      "needs-information",
      "not-actionable",
    ];

    if (!allowedAssessments.includes(assessment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint assessment",
      });
    }

    complaint.assessment = assessment;

    complaint.reviewedBy = req.user._id;

    if (adminRemarks !== undefined) {
      complaint.adminRemarks = adminRemarks;
    }

    if (assessment === "actionable") {
      complaint.status = "in-progress";
    }

    if (assessment === "needs-information") {
      complaint.status = "needs-information";
    }

    if (assessment === "not-actionable") {
      complaint.status = "closed";
    }

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(complaint._id)
        .populate("user", "name email")
        .populate("issue")
        .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Complaint assessed successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

const createDocumentRequest = async (req, res, next) => {
  try {
    const { documentName, instructions } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.assessment !== "needs-information") {
      return res.status(400).json({
        success: false,
        message:
          "Documents can only be requested when more information is needed",
      });
    }

    if (complaint.status !== "needs-information") {
      return res.status(400).json({
        success: false,
        message:
          "Complaint is not waiting for additional information",
      });
    }

    const existingPendingRequest =
      await DocumentRequest.findOne({
        complaint: complaint._id,
        status: "pending",
      });

    if (existingPendingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "A pending document request already exists for this complaint",
      });
    }

    const documentRequest = await DocumentRequest.create({
      complaint: complaint._id,
      requestedBy: req.user._id,
      documentName,
      instructions,
    });

    const populatedRequest =
      await DocumentRequest.findById(documentRequest._id)
        .populate("requestedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Document requested successfully",
      documentRequest: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllComplaints,getAdminComplaintById,updateComplaintStatus,getAdminDashboard,assessComplaint,createDocumentRequest
};
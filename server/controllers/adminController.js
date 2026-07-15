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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid complaint ID",
  });
}
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

    const validTransitions = {
      submitted: ["in-progress"],
      "in-progress": ["resolved"],
      resolved: ["closed"],
      closed: [],
    };

    // Validate status only when it is actually being changed
    if (status && status !== complaint.status) {
      const allowedNextStatuses =
        validTransitions[complaint.status] || [];

      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change complaint status from ${complaint.status} to ${status}`,
        });
      }

      complaint.status = status;
    }

    // Update admin remarks separately
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
      error: error.message,
    });
  }
};

  const getAdminDashboard = async (req, res) => {
  try {
    const [
      total,  submitted,  needsInformation,inProgress,
      resolved,  closed,  recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "submitted",
      }),

          Complaint.countDocuments({
        status: "needs-information",
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
        submitted,needsInformation,
        inProgress, resolved, closed,},

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

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

    // Prevent reassessment after complaint is resolved or closed
    if (
      ["resolved", "closed"].includes(
        complaint.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assessment cannot be changed for resolved or closed complaints",
      });
    }

    const allowedAssessments = [
      "actionable",
      "needs-information",
      "not-actionable",
    ];

    if (
      !allowedAssessments.includes(assessment)
    ) {
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
    } else if (
      assessment === "needs-information"
    ) {
      complaint.status = "submitted";
    } else if (
      assessment === "not-actionable"
    ) {
      complaint.status = "closed";
    }

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(complaint._id)
        .populate("user", "name email")
        .populate("issue")
        .populate(
          "reviewedBy",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Complaint assessment updated successfully",
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

if (
  !["actionable", "needs-information"].includes(
    complaint.assessment
  )
) {
  return res.status(400).json({
    success: false,
    message:
      "Documents can only be requested for actionable complaints or complaints requiring more information",
  });
}

if (
  ["resolved", "closed"].includes(complaint.status)
) {
  return res.status(400).json({
    success: false,
    message:
      "Documents cannot be requested for resolved or closed complaints",
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

const reviewRequestedDocument = async (
  req,res, next) => {
  try {
    const { id, requestId } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const documentRequest =
      await DocumentRequest.findOne({
        _id: requestId,
        complaint: complaint._id,
      });

    if (!documentRequest) {
      return res.status(404).json({
        success: false,
        message: "Document request not found",
      });
    }

    if (documentRequest.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message:
          "Only submitted documents can be reviewed",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Review status must be accepted or rejected",
      });
    }

    const uploadedDocument =
      await ComplaintDocument.findOne({
        complaint: complaint._id,
        documentRequest: documentRequest._id,
        documentType: "requested",
      });

    if (!uploadedDocument) {
      return res.status(404).json({
        success: false,
        message:
          "Uploaded document not found for this request",
      });
    }

    documentRequest.status = status;
    documentRequest.reviewedAt = new Date();

    uploadedDocument.reviewStatus = status;
    uploadedDocument.reviewedBy = req.user._id;
    uploadedDocument.reviewedAt = new Date();

if (status === "accepted") {
  complaint.status = "in-progress";
}

    await Promise.all([
      documentRequest.save(),
      uploadedDocument.save(),
      complaint.save(),   
    ]);

    return res.status(200).json({
      success: true,
      message: `Document ${status} successfully`,
      documentRequest,
      document: uploadedDocument,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

const resolveComplaint = async (req, res, next) => {
  try {
    const { actionTaken, resolutionSummary } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Only in-progress complaints can be resolved
    if (complaint.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message:
          "Only in-progress complaints can be resolved",
      });
    }

    complaint.actionTaken = actionTaken;
    complaint.resolutionSummary = resolutionSummary;
    complaint.resolvedAt = new Date();
    complaint.status = "resolved";
    complaint.reviewedBy = req.user._id;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(
      complaint._id
    )
      .populate("user", "name email")
      .populate("issue")
      .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

const reviseComplaintResolution = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      actionTaken,
      resolutionSummary,
      adminRemarks,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (
      complaint.status !== "resolved" ||
      complaint.satisfied !== false
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only an unsatisfied resolved complaint can be revised",
      });
    }

    complaint.actionTaken = actionTaken;
    complaint.resolutionSummary =
      resolutionSummary;
    complaint.adminRemarks = adminRemarks;

    // Allow user to give feedback again
    complaint.satisfied = null;
    complaint.feedbackComment = "";
    complaint.feedbackSubmittedAt = null;

    complaint.reviewedBy = req.user._id;

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(complaint._id)
        .populate("user", "name email")
        .populate("issue")
        .populate(
          "reviewedBy",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Resolution revised successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

const reviewComplaintDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { status, adminReviewRemarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    const document = await ComplaintDocument.findById(
      documentId
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    document.reviewStatus = status;
    document.reviewedBy = req.user._id;
    document.reviewedAt = new Date();

    if (adminReviewRemarks !== undefined) {
      document.adminReviewRemarks =
        adminReviewRemarks;
    }

    await document.save();

    const populatedDocument =
      await ComplaintDocument.findById(document._id)
        .populate("uploadedBy", "name email")
        .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      message: `Document ${status} successfully`,
      document: populatedDocument,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllComplaints,getAdminComplaintById,updateComplaintStatus,getAdminDashboard,assessComplaint,createDocumentRequest,reviewRequestedDocument,reviewComplaintDocument,resolveComplaint,reviseComplaintResolution 
};
import mongoose from "mongoose";

const complaintDocumentSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentRequest",
      default: null,
    },

    documentType: {
      type: String,
      enum: ["initial", "requested"],
      required: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    reviewStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    adminReviewRemarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ComplaintDocument = mongoose.model(
  "ComplaintDocument",
  complaintDocumentSchema
);

export default ComplaintDocument;
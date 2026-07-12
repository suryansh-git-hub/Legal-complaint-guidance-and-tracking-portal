import mongoose from "mongoose";

const documentRequestSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentName: {
      type: String,
      required: [
        true,
        "Document name is required",
      ],
      trim: true,
      maxlength: 150,
    },

    instructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "submitted",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },

    submittedAt: {
      type: Date,
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

const DocumentRequest = mongoose.model(
  "DocumentRequest",
  documentRequestSchema
);

export default DocumentRequest;
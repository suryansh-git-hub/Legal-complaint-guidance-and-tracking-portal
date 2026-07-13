import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: [true, "Issue is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [
        true,
        "Complaint description is required",
      ],
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "in-progress",
        "resolved",
        "closed",
      ],
      default: "submitted",
    },

    assessment: {
      type: String,
      enum: [
        "pending",
        "actionable",
        "needs-information",
        "not-actionable",
      ],
      default: "pending",
    },

    notes: {
      type: [String],
      default: [],
    },

    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    actionTaken: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    resolutionSummary: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
     
    resolvedAt: {
  type: Date,
  default: null,
},

satisfied: {
  type: Boolean,
  default: null,
},

feedbackComment: {
  type: String,
  trim: true,
  maxlength: 1000,
  default: "",
},

feedbackSubmittedAt: {
  type: Date,
  default: null,
},

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model(
  "Complaint",
  complaintSchema
);

export default Complaint;
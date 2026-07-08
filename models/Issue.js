import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    immediateSteps: {
      type: [String],
      default: [],
    },

    requiredDocuments: {
      type: [String],
      default: [],
    },

    complaintSteps: {
      type: [String],
      default: [],
    },

    officialResources: {
      type: [resourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
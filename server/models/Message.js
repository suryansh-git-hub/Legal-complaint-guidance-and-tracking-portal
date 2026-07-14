import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;
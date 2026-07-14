import Complaint from "../models/Complaint.js";
import Message from "../models/Message.js";

/*
  @desc    Get all messages for a complaint
  @route   GET /api/complaints/:id/messages
  @access  Private
*/
const getComplaintMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    /*
      Normal users can only access messages
      belonging to their own complaints.

      Admins can access messages of any complaint.
    */
    if (
      req.user.role !== "admin" &&
      complaint.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view these messages",
      });
    }

    const messages = await Message.find({
      complaint: id,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load complaint messages",
      error: error.message,
    });
  }
};

/*
  @desc    Send message in complaint conversation
  @route   POST /api/complaints/:id/messages
  @access  Private
*/
const sendComplaintMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    /*
      Normal users can only send messages
      for their own complaints.

      Admins can send messages for any complaint.
    */
    if (
      req.user.role !== "admin" &&
      complaint.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to send messages for this complaint",
      });
    }

    /*
      Do not allow messages after complaint
      has been closed.
    */
    if (complaint.status === "closed") {
      return res.status(400).json({
        success: false,
        message:
          "Messages cannot be sent for a closed complaint",
      });
    }

    const newMessage = await Message.create({
      complaint: complaint._id,
      sender: req.user._id,
      senderRole: req.user.role,
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    ).populate("sender", "name email role");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      conversationMessage: populatedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export {
  getComplaintMessages,
  sendComplaintMessage,
};
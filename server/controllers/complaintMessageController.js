import Complaint from "../models/Complaint.js";
import ComplaintMessage from "../models/ComplaintMessage.js";

const getComplaintMessages = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(
      complaintId
    );

    if (!complaint) {
      return res.status(404).json({
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
      complaint.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to access this conversation",
      });
    }

    const messages = await ComplaintMessage.find({
      complaint: complaintId,
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const sendComplaintMessage = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { message } = req.body;

    const complaint = await Complaint.findById(
      complaintId
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    /*
      Normal users can only send messages
      on their own complaints.

      Admins can send messages on any complaint.
    */

    if (
      req.user.role !== "admin" &&
      complaint.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to send a message for this complaint",
      });
    }

    /*
      Prevent conversations after the complaint
      has been closed.
    */
if (
  complaint.status === "resolved" ||
  complaint.status === "closed"
) {
  return res.status(400).json({
    success: false,
    message:
      "Messages cannot be sent after a complaint has been resolved or closed",
  });
}

    const complaintMessage =
      await ComplaintMessage.create({
        complaint: complaintId,
        sender: req.user._id,
        senderRole: req.user.role,
            message: message.trim(),

      });

    await complaintMessage.populate(
      "sender",
      "name role"
    );

    return res.status(201).json({
      message: "Message sent successfully",
      complaintMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getComplaintMessages,
  sendComplaintMessage,
};
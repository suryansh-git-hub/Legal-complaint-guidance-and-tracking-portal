import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/axios";

function AdminComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/admin/complaints/${id}`
        );

        const complaintData = response.data.complaint;

        setComplaint(complaintData);

        setStatus(complaintData.status);

        setAdminRemarks(
          complaintData.adminRemarks || ""
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load complaint"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/admin/complaints/${id}/status`,
        {
          status,
          adminRemarks,
        }
      );

      setComplaint(response.data.complaint);

      setMessage(
        "Complaint updated successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p>Loading complaint...</p>;
  }

  if (error && !complaint) {
    return <p>{error}</p>;
  }

  if (!complaint) {
    return <p>Complaint not found.</p>;
  }

  return (
    <div>
      <Link to="/admin/complaints">
        Back to All Complaints
      </Link>

      <h1>Complaint Details</h1>

      <section>
        <h2>{complaint.title}</h2>

        <p>{complaint.description}</p>
      </section>

      <section>
        <h2>User Information</h2>

        <p>
          Name:{" "}
          {complaint.user?.name || "Unknown User"}
        </p>

        <p>
          Email:{" "}
          {complaint.user?.email ||
            "Not available"}
        </p>
      </section>

      <section>
        <h2>Current Complaint Information</h2>

        <p>Status: {complaint.status}</p>

        <p>
          Created:{" "}
          {new Date(
            complaint.createdAt
          ).toLocaleDateString()}
        </p>
      </section>

      <section>
        <h2>Manage Complaint</h2>

        <form onSubmit={handleUpdate}>
          <div>
            <label>Complaint Status</label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="submitted">
                Submitted
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="resolved">
                Resolved
              </option>

              <option value="closed">
                Closed
              </option>
            </select>
          </div>

          <div>
            <label>Admin Remarks</label>

            <textarea
              value={adminRemarks}
              onChange={(e) =>
                setAdminRemarks(e.target.value)
              }
              placeholder="Add remarks for the user"
            />
          </div>

          {error && <p>{error}</p>}

          {message && <p>{message}</p>}

          <button
            type="submit"
            disabled={updating}
          >
            {updating
              ? "Updating..."
              : "Update Complaint"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AdminComplaintDetails;
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/complaints/${id}`
        );

        setComplaint(response.data.complaint);
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

  if (loading) {
    return <p>Loading complaint...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!complaint) {
    return <p>Complaint not found.</p>;
  }

  return (
    <div>
      <Link to="/complaints">
        Back to My Complaints
      </Link>

      <h1>{complaint.title}</h1>

      <p>{complaint.description}</p>

      <div>
        <h2>Complaint Status</h2>

        <p>{complaint.status}</p>
      </div>

      <div>
        <h2>Admin Remarks</h2>

        <p>
          {complaint.adminRemarks ||
            "No remarks from the Legal Admin yet."}
        </p>
      </div>

      <div>
        <h2>Complaint Information</h2>

        <p>
          Created:{" "}
          {new Date(
            complaint.createdAt
          ).toLocaleDateString()}
        </p>

        <p>
          Last Updated:{" "}
          {new Date(
            complaint.updatedAt
          ).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ComplaintDetails;
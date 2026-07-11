import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";

function ComplaintTracking() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/complaints");

        setComplaints(response.data.complaints);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load complaint tracking"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p>Loading complaint tracking...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Track My Complaints</h1>

      <p>
        Check the current progress of your submitted complaints.
      </p>

      {complaints.length === 0 ? (
        <div>
          <p>You have not submitted any complaints yet.</p>

          <Link to="/complaints/new">
            Create Complaint
          </Link>
        </div>
      ) : (
        <div>
          {complaints.map((complaint) => (
            <div key={complaint._id}>
              <h2>{complaint.title}</h2>

              <p>
                Current Status: {complaint.status}
              </p>

              <p>
                Submitted:{" "}
                {new Date(
                  complaint.createdAt
                ).toLocaleDateString()}
              </p>

              <Link
                to={`/complaints/${complaint._id}`}
              >
                View Tracking Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintTracking;
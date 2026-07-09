import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";

function MyComplaints() {
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
            "Failed to load complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Complaints</h1>

      <Link to="/complaints/new">
        Create New Complaint
      </Link>

      {complaints.length === 0 ? (
        <p>You have not created any complaints.</p>
      ) : (
        <div>
          {complaints.map((complaint) => (
            <div key={complaint._id}>
              <h2>{complaint.title}</h2>

              <p>
                Status: {complaint.status}
              </p>

              <p>
                Created:{" "}
                {new Date(
                  complaint.createdAt
                ).toLocaleDateString()}
              </p>

              <Link
                to={`/complaints/${complaint._id}`}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
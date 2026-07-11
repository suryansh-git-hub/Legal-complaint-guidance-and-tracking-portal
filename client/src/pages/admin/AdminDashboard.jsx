import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/dashboard"
        );

        setDashboardData(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load Admin Dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) {
    return <p>Loading Admin Dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      <p>
        View and manage complaints submitted by users.
      </p>

      <div>
        <div>
          <h2>Total Complaints</h2>

          <p>{dashboardData?.stats?.total ?? 0}</p>
        </div>

        <div>
          <h2>Draft</h2>

          <p>{dashboardData?.stats?.draft ?? 0}</p>
        </div>

        <div>
          <h2>Submitted</h2>

          <p>
            {dashboardData?.stats?.submitted ?? 0}
          </p>
        </div>

        <div>
          <h2>In Progress</h2>

          <p>
            {dashboardData?.stats?.inProgress ?? 0}
          </p>
        </div>

        <div>
          <h2>Resolved</h2>

          <p>
            {dashboardData?.stats?.resolved ?? 0}
          </p>
        </div>

        <div>
          <h2>Closed</h2>

          <p>{dashboardData?.stats?.closed ?? 0}</p>
        </div>
      </div>

      <div>
        <Link to="/admin/complaints">
          Manage All Complaints
        </Link>
      </div>

      <section>
        <h2>Recent Complaints</h2>

        {dashboardData?.recentComplaints?.length ===
        0 ? (
          <p>No recent complaints found.</p>
        ) : (
          dashboardData?.recentComplaints?.map(
            (complaint) => (
              <div key={complaint._id}>
                <h3>{complaint.title}</h3>

                <p>
                  User:{" "}
                  {complaint.user?.name ||
                    "Unknown User"}
                </p>

                <p>Status: {complaint.status}</p>

                <Link
                  to={`/admin/complaints/${complaint._id}`}
                >
                  View Complaint
                </Link>
              </div>
            )
          )
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
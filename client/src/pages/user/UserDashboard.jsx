import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/complaints/stats");

        setDashboardData(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      <p>View and manage your legal complaints.</p>

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
          <p>{dashboardData?.stats?.submitted ?? 0}</p>
        </div>

        <div>
          <h2>In Progress</h2>
          <p>{dashboardData?.stats?.inProgress ?? 0}</p>
        </div>

        <div>
          <h2>Resolved</h2>
          <p>{dashboardData?.stats?.resolved ?? 0}</p>
        </div>

        <div>
          <h2>Closed</h2>
          <p>{dashboardData?.stats?.closed ?? 0}</p>
        </div>
      </div>

      <div>
        <Link to="/complaints/new">
          Create Complaint
        </Link>

        <Link to="/complaints">
          My Complaints
        </Link>
      </div>

      <section>
        <h2>Recent Complaints</h2>

        {dashboardData?.recentComplaints?.length === 0 ? (
          <p>No recent complaints found.</p>
        ) : (
          dashboardData?.recentComplaints?.map((complaint) => (
            <div key={complaint._id}>
              <h3>{complaint.title}</h3>

              <p>Status: {complaint.status}</p>

              <Link to={`/complaints/${complaint._id}`}>
                View Details
              </Link>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
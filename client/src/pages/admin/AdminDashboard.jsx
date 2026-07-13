import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Send,LoaderCircle,CircleCheckBig, Archive, ArrowRight,ShieldCheck, Users,CircleHelp,} from "lucide-react";

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

  const formatStatus = (status) => {
    return status
      ?.replace("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-700";

          case "needs-information":
      return "bg-orange-50 text-orange-700";
      
      case "in-progress":
        return "bg-amber-50 text-amber-700";

      case "resolved":
        return "bg-green-50 text-green-700";

      case "closed":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Complaints",
      value: dashboardData?.stats?.total ?? 0,
      icon: FileText,
    },
    {
      title: "Submitted",
      value: dashboardData?.stats?.submitted ?? 0,
      icon: Send,
    },
    {
    title: "Needs Information",
    value:
      dashboardData?.stats?.needsInformation ?? 0,
    icon: CircleHelp,
  },
    {
      title: "In Progress",
      value: dashboardData?.stats?.inProgress ?? 0,
      icon: LoaderCircle,
    },
    {
      title: "Resolved",
      value: dashboardData?.stats?.resolved ?? 0,
      icon: CircleCheckBig,
    },
    {
      title: "Closed",
      value: dashboardData?.stats?.closed ?? 0,
      icon: Archive,
    },
  ];

  return (
    <div>
      {/* Header */}

      <section className="mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <ShieldCheck className="h-4 w-4" />
          Legal Administration
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Welcome, {user?.name}. Review complaint activity,
          manage submitted complaints, and provide status
          updates to users.
        </p>
      </section>

      {/* Statistics */}

      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Complaint Overview
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complaint Management */}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Complaint Management
        </h2>

        <Link
          to="/admin/complaints"
          className="group mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Manage All Complaints
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Review complaints submitted by users, update
                their status, and provide administrative
                remarks.
              </p>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
      </section>

      {/* Recent Complaints */}

      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Complaints
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recently submitted complaints requiring
              administrative review.
            </p>
          </div>

          <Link
            to="/admin/complaints"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {dashboardData?.recentComplaints?.length ===
        0 ? (
          <div className="px-6 py-14 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />

            <h3 className="mt-4 font-semibold text-gray-900">
              No complaints found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Recent complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {dashboardData.recentComplaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {complaint.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>
                        Submitted by{" "}
                        <span className="font-medium text-gray-700">
                          {complaint.user?.name ||
                            "Unknown User"}
                        </span>
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {formatStatus(complaint.status)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/complaints/${complaint._id}`}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Review Complaint
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
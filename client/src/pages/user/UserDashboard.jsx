import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Send,
  LoaderCircle,
  CircleCheckBig,
  Archive,
  Plus,
  ArrowRight,
  Scale,
} from "lucide-react";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/complaints/stats"
        );

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading your dashboard...
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
      title: "Draft",
      value: dashboardData?.stats?.draft ?? 0,
      icon: Clock,
    },
    {
      title: "Submitted",
      value: dashboardData?.stats?.submitted ?? 0,
      icon: Send,
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

  const formatStatus = (status) => {
    return status
      ?.replace("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <div>
      {/* Dashboard Header */}

      <section className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          User Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          View your complaint activity, check recent updates,
          and manage your legal complaints.
        </p>
      </section>

      {/* Statistics */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Complaint Overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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

      {/* Quick Actions */}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            to="/categories"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Create a Complaint
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Select a legal issue and submit a new
                  complaint.
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>

          <Link
            to="/complaints"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  My Complaints
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  View and track your submitted complaints.
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>
        </div>
      </section>

      {/* Recent Complaints */}

      <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Complaints
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your most recently created complaints.
            </p>
          </div>

          <Link
            to="/complaints"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {dashboardData?.recentComplaints?.length ===
        0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No complaints yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
              You have not created any complaints. Browse
              legal guidance to select an issue and submit
              your first complaint.
            </p>

            <Link
              to="/categories"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Browse Legal Guidance
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {dashboardData.recentComplaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {complaint.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {formatStatus(complaint.status)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/complaints/${complaint._id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details
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

export default UserDashboard;
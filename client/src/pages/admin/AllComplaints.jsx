import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  FileSearch,

  LoaderCircle,
  Search,
  User,
} from "lucide-react";

import api from "../../api/axios";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("all");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/complaints"
        );

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

  const filteredComplaints = complaints.filter(
    (complaint) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        complaint.title
          ?.toLowerCase()
          .includes(search) ||
        complaint.user?.name
          ?.toLowerCase()
          .includes(search) ||
        complaint.user?.email
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        selectedStatus === "all" ||
        complaint.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading complaints...
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

  return (
    <div>
      {/* Header */}

      <section className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Complaint Management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          All Complaints
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Review complaints submitted by users and manage
          their current status and administrative remarks.
        </p>
      </section>

      {/* Search and Filter */}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search by complaint title, user name, or email..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              All Statuses
            </option>

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
      </section>

      {/* Results Information */}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredComplaints.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {complaints.length}
          </span>{" "}
          complaints
        </p>
      </div>

      {/* Complaint List */}

      {filteredComplaints.length === 0 ? (
        <section className="mt-4 rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <FileSearch className="h-7 w-7 text-gray-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No complaints found
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            No complaints match your current search and
            filter criteria.
          </p>
        </section>
      ) : (
        <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredComplaints.map(
              (complaint) => (
                <div
                  key={complaint._id}
                  className="p-6 transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* Title and Status */}

                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {complaint.title}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {formatStatus(
                            complaint.status
                          )}
                        </span>
                      </div>

                      {/* User Information */}

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />

                          <span>
                            {complaint.user?.name ||
                              "Unknown User"}
                          </span>
                        </div>

                        <span className="hidden text-gray-300 sm:inline">
                          |
                        </span>

                        <span>
                          {complaint.user?.email ||
                            "Email unavailable"}
                        </span>

                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />

                          <span>
                            {new Date(
                              complaint.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}

                      <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-600">
                        {complaint.description?.length >
                        180
                          ? `${complaint.description.slice(
                              0,
                              180
                            )}...`
                          : complaint.description}
                      </p>
                    </div>

                    {/* Review Button */}

                    <Link
                      to={`/admin/complaints/${complaint._id}`}
                      className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Review Complaint
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default AllComplaints;
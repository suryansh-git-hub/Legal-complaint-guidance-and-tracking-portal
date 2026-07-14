import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FileText,
  ArrowRight,
  Plus,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";

import api from "../../api/axios";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ==============================
     Fetch User Complaints
  ============================== */

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await api.get(
          "/complaints"
        );

        setComplaints(
          response.data.complaints
        );
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

  /* ==============================
     Format Complaint Status
  ============================== */

  const formatStatus = (status) => {
    return status
      ?.replaceAll("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* ==============================
     Complaint Status Styles
  ============================== */

  const getStatusStyle = (status) => {
    switch (status) {
      case "draft":
        return `
          bg-gray-100
          text-gray-700
          dark:bg-gray-700
          dark:text-gray-200
        `;

      case "submitted":
        return `
          bg-blue-50
          text-blue-700
          dark:bg-blue-950/50
          dark:text-blue-300
        `;

      case "needs-information":
        return `
          bg-orange-50
          text-orange-700
          dark:bg-orange-950/50
          dark:text-orange-300
        `;

      case "in-progress":
        return `
          bg-amber-50
          text-amber-700
          dark:bg-amber-950/50
          dark:text-amber-300
        `;

      case "resolved":
        return `
          bg-green-50
          text-green-700
          dark:bg-green-950/50
          dark:text-green-300
        `;

      case "closed":
        return `
          bg-slate-100
          text-slate-700
          dark:bg-slate-700
          dark:text-slate-200
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          dark:bg-gray-700
          dark:text-gray-200
        `;
    }
  };

  /* ==============================
     Loading State
  ============================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading your complaints...
          </p>
        </div>
      </div>
    );
  }

  /* ==============================
     Error State
  ============================== */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* ==============================
          Page Header
      ============================== */}

      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Complaint Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My Complaints
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            View your submitted complaints and track
            their current progress.
          </p>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />

          New Complaint
        </Link>
      </section>

      {/* ==============================
          Empty Complaints State
      ============================== */}

      {complaints.length === 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
            <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No complaints found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
            You have not created any complaints yet.
            Browse legal guidance, select your issue,
            and create a complaint.
          </p>

          <Link
            to="/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Browse Legal Guidance

            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        /* ==============================
           Complaint List
        ============================== */

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Complaint Count */}

          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Complaints:{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {complaints.length}
              </span>
            </p>
          </div>

          {/* Complaints */}

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="p-6 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Complaint Information */}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {complaint.title}
                      </h2>

                      {/* Status Badge */}

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

                    {/* Created Date */}

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />

                      <span>
                        Created on{" "}
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {complaint.description}
                    </p>
                  </div>

                  {/* View Details */}

                  <Link
                    to={`/complaints/${complaint._id}`}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyComplaints;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  FileText,
  LoaderCircle,
  MessageSquareText,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

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

      const updatedComplaint =
        response.data.complaint;

      setComplaint(updatedComplaint);
      setStatus(updatedComplaint.status);
      setAdminRemarks(
        updatedComplaint.adminRemarks || ""
      );

      setMessage(
        "Complaint updated successfully."
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

  const formatStatus = (statusValue) => {
    return statusValue
      ?.replace("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusStyle = (statusValue) => {
    switch (statusValue) {
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading complaint details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Back Link */}

      <Link
        to="/admin/complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Complaints
      </Link>

      {/* Header */}

      <section className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              Administrative Review
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {complaint.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />

              Submitted on{" "}
              {new Date(
                complaint.createdAt
              ).toLocaleDateString()}
            </div>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
              complaint.status
            )}`}
          >
            {formatStatus(complaint.status)}
          </span>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left Side */}

        <div className="space-y-6">
          {/* Complaint Information */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <FileText className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                Complaint Information
              </h2>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-gray-500">
                Description
              </p>

              <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
                {complaint.description}
              </p>
            </div>
          </section>

          {/* User Information */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <User className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                User Information
              </h2>
            </div>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Name
                </dt>

                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {complaint.user?.name ||
                    "Unknown User"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email Address
                </dt>

                <dd className="mt-1 text-sm text-gray-700">
                  {complaint.user?.email ||
                    "Not available"}
                </dd>
              </div>
            </dl>
          </section>

          {/* Existing Admin Remarks */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <MessageSquareText className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                Current Admin Remarks
              </h2>
            </div>

            <div className="mt-5">
              {complaint.adminRemarks ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="leading-7 text-gray-700">
                    {complaint.adminRemarks}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-5 text-center">
                  <p className="text-sm text-gray-500">
                    No administrative remarks have been
                    added yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side - Management Form */}

        <aside>
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <ShieldCheck className="h-5 w-5 text-blue-600" />

              <div>
                <h2 className="font-semibold text-gray-900">
                  Manage Complaint
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update status and remarks.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleUpdate}
              className="mt-5 space-y-5"
            >
              {/* Status */}

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Complaint Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              {/* Remarks */}

              <div>
                <label
                  htmlFor="adminRemarks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admin Remarks
                </label>

                <p className="mt-1 text-xs text-gray-500">
                  These remarks will be visible to the user.
                </p>

                <textarea
                  id="adminRemarks"
                  value={adminRemarks}
                  onChange={(e) =>
                    setAdminRemarks(e.target.value)
                  }
                  placeholder="Enter administrative remarks..."
                  rows={7}
                  maxLength={1000}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {adminRemarks.length}/1000
                </p>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div className="flex gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{message}</span>
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={updating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Complaint
                  </>
                )}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminComplaintDetails;
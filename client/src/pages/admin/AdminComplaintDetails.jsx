
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  FileText,ExternalLink,
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
  const [assessment, setAssessment] = useState("");
  const [assessing, setAssessing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
const [documentName, setDocumentName] = useState("");
const [documentInstructions, setDocumentInstructions] = useState("");
const [requestingDocument, setRequestingDocument] = useState(false);
const [reviewingRequestId, setReviewingRequestId] = useState(null);
const [actionTaken, setActionTaken] = useState("");
const [resolutionSummary, setResolutionSummary] =
  useState("");
const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/admin/complaints/${id}`);

        const complaintData = response.data.complaint;

        setComplaint(complaintData);
        setDocuments(response.data.documents || []);
        setDocumentRequests(response.data.documentRequests || []);
        setStatus(complaintData.status);
        setAdminRemarks(complaintData.adminRemarks || "");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load complaint");
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

    const updateData = {
      adminRemarks,
    };

    // Send status only if admin actually changed it
    if (status !== complaint.status) {
      updateData.status = status;
    }

    const response = await api.put(
      `/admin/complaints/${id}/status`,
      updateData
    );

    const updatedComplaint = response.data.complaint;

    setComplaint(updatedComplaint);
    setStatus(updatedComplaint.status);
    setAdminRemarks(
      updatedComplaint.adminRemarks || ""
    );

    setMessage("Complaint updated successfully.");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to update complaint"
    );
  } finally {
    setUpdating(false);
  }
};

  const handleAssessment = async (e) => {
    e.preventDefault();

    try {
      setAssessing(true);
      setError("");
      setMessage("");

      const response = await api.put(`/admin/complaints/${id}/assessment`, {
        assessment,
        adminRemarks,
      });

      const updatedComplaint = response.data.complaint;

      setComplaint(updatedComplaint);
      setStatus(updatedComplaint.status);
      setAdminRemarks(updatedComplaint.adminRemarks || "");

      setMessage("Complaint assessed successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to assess complaint");
    } finally {
      setAssessing(false);
    }
  };

  const handleDocumentRequest = async (e) => {
  e.preventDefault();

  try {
    setRequestingDocument(true);
    setError("");
    setMessage("");

    const response = await api.post(
      `/admin/complaints/${id}/document-requests`,
      {
        documentName,
        instructions: documentInstructions,
      }
    );

    setDocumentRequests((previousRequests) => [
      response.data.documentRequest,
      ...previousRequests,
    ]);

    setDocumentName("");
    setDocumentInstructions("");

    setMessage("Document requested successfully.");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to request document"
    );
  } finally {
    setRequestingDocument(false);
  }
};

const handleDocumentReview = async (requestId, reviewStatus) => {
  try {
    setReviewingRequestId(requestId);
    setError("");
    setMessage("");

    const response = await api.put(
      `/admin/complaints/${id}/document-requests/${requestId}/review`,
      {
        status: reviewStatus,
      }
    );

    const updatedRequest = response.data.documentRequest;
    const updatedDocument = response.data.document;
    const updatedComplaint = response.data.complaint;

    setDocumentRequests((previousRequests) =>
      previousRequests.map((request) =>
        request._id === requestId
          ? updatedRequest
          : request
      )
    );

    setDocuments((previousDocuments) =>
      previousDocuments.map((document) =>
        document._id === updatedDocument._id
          ? updatedDocument
          : document
      )
    );

    setComplaint(updatedComplaint);
setStatus(updatedComplaint.status);

    setMessage(
      `Document ${reviewStatus} successfully.`
    );
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to review document"
    );
  } finally {
    setReviewingRequestId(null);
  }
};

const handleResolveComplaint = async (e) => {
  e.preventDefault();

  try {
    setResolving(true);
    setError("");
    setMessage("");

    const response = await api.put(
      `/admin/complaints/${id}/resolve`,
      {
        actionTaken,
        resolutionSummary,
      }
    );

    const updatedComplaint = response.data.complaint;

    setComplaint(updatedComplaint);
    setStatus(updatedComplaint.status);

    setActionTaken(updatedComplaint.actionTaken || "");
    setResolutionSummary(
      updatedComplaint.resolutionSummary || ""
    );

    setMessage("Complaint resolved successfully.");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to resolve complaint"
    );
  } finally {
    setResolving(false);
  }
};
  const formatStatus = (statusValue) => {
    return statusValue?.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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

 const nextStatusMap = {
  submitted: "in-progress",
  "in-progress": null,
  resolved: null,
  closed: null,
};

  const nextStatus = complaint ? nextStatusMap[complaint.status] : null;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>;
  }

  if (!complaint) {
    return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">Complaint not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/admin/complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Complaints
      </Link>

      <section className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              Administrative Review
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{complaint.title}</h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
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
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Complaint Information</h2>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">{complaint.description}</p>
            </div>
          </section>
            {/* Supporting Documents */}

<section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
    <FileText className="h-5 w-5 text-blue-600" />

    <h2 className="text-lg font-semibold text-gray-900">
      Supporting Documents
    </h2>
  </div>

 

  <div className="mt-5">
  {documents.length > 0 ? (
    <div className="space-y-3">
      {documents.map((document) => {
        const relatedRequest = documentRequests.find(
          (request) =>
            request._id ===
            (document.documentRequest?._id ||
              document.documentRequest)
        );

        return (
          <div
            key={document._id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {document.originalName}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Review Status:{" "}
                  <span className="font-medium capitalize">
                    {document.reviewStatus || "pending"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a
                href={`${
                  import.meta.env.VITE_UPLOADS_BASE_URL ||
                  "http://localhost:5000"
                }${document.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                View Document

                <ExternalLink className="h-4 w-4" />
              </a>

              {relatedRequest?.status === "submitted" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handleDocumentReview(
                        relatedRequest._id,
                        "accepted"
                      )
                    }
                    disabled={
                      reviewingRequestId === relatedRequest._id
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewingRequestId === relatedRequest._id
                      ? "Reviewing..."
                      : "Accept"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDocumentReview(
                        relatedRequest._id,
                        "rejected"
                      )
                    }
                    disabled={
                      reviewingRequestId === relatedRequest._id
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewingRequestId === relatedRequest._id
                      ? "Reviewing..."
                      : "Reject"}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      No supporting documents were uploaded.
    </p>
  )}
</div>
</section>
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            </div>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{complaint.user?.name || "Unknown User"}</dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Email Address</dt>
                <dd className="mt-1 text-sm text-gray-700">{complaint.user?.email || "Not available"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <MessageSquareText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Current Admin Remarks</h2>
            </div>

            <div className="mt-5">
              {complaint.adminRemarks ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="leading-7 text-gray-700">{complaint.adminRemarks}</p>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-5 text-center">
                  <p className="text-sm text-gray-500">No administrative remarks have been added yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside>
          {complaint.assessment === "pending" && (
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="font-semibold text-gray-900">Complaint Assessment</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Review the complaint and supporting documents before making an assessment.
                </p>
              </div>

              <form onSubmit={handleAssessment} className="mt-5 space-y-5">
                <div>
                  <label htmlFor="assessment" className="block text-sm font-medium text-gray-700">
                    Assessment Decision
                  </label>

                  <select
                    id="assessment"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select assessment</option>
                    <option value="actionable">Actionable</option>
                    <option value="needs-information">Needs More Information</option>
                    <option value="not-actionable">Not Actionable</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="assessmentRemarks" className="block text-sm font-medium text-gray-700">
                    Assessment Remarks
                  </label>

                  <textarea
                    id="assessmentRemarks"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Explain the assessment decision..."
                    rows={5}
                    maxLength={1000}
                    className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={assessing || !assessment}
                  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {assessing ? "Assessing..." : "Submit Assessment"}
                </button>
              </form>
            </section>
          )}

      

          {/* Completed Assessment */}

{complaint.assessment !== "pending" && (
  <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="font-semibold text-gray-900">
      Complaint Assessment
    </h2>

    <div className="mt-4 rounded-lg bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Assessment Decision
      </p>

      <p className="mt-2 font-semibold capitalize text-gray-900">
        {complaint.assessment.replace("-", " ")}
      </p>
    </div>
  </section>
)}

{complaint.assessment === "needs-information" && (
  <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="border-b border-gray-200 pb-4">
      <h2 className="font-semibold text-gray-900">
        Request Additional Document
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Ask the user to provide additional proof or supporting
        documentation.
      </p>
    </div>

    <form
      onSubmit={handleDocumentRequest}
      className="mt-5 space-y-5"
    >
      <div>
        <label
          htmlFor="documentName"
          className="block text-sm font-medium text-gray-700"
        >
          Required Document
        </label>

        <input
          id="documentName"
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Example: Identity Proof"
          maxLength={150}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="documentInstructions"
          className="block text-sm font-medium text-gray-700"
        >
          Instructions
        </label>

        <textarea
          id="documentInstructions"
          value={documentInstructions}
          onChange={(e) =>
            setDocumentInstructions(e.target.value)
          }
          placeholder="Explain what document the user should upload..."
          rows={5}
          maxLength={1000}
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={requestingDocument}
        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {requestingDocument
          ? "Requesting..."
          : "Request Document"}
      </button>
    </form>
  </section>
)}

{complaint.status === "in-progress" && (
  <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="border-b border-gray-200 pb-4">
      <h2 className="font-semibold text-gray-900">
        Final Resolution
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Record the action taken and provide the final
        resolution for the user.
      </p>
    </div>

    <form
      onSubmit={handleResolveComplaint}
      className="mt-5 space-y-5"
    >
      <div>
        <label
          htmlFor="actionTaken"
          className="block text-sm font-medium text-gray-700"
        >
          Action Taken
        </label>

        <textarea
          id="actionTaken"
          value={actionTaken}
          onChange={(e) =>
            setActionTaken(e.target.value)
          }
          placeholder="Describe the action taken..."
          rows={5}
          maxLength={2000}
          required
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {actionTaken.length}/2000
        </p>
      </div>

      <div>
        <label
          htmlFor="resolutionSummary"
          className="block text-sm font-medium text-gray-700"
        >
          Resolution Summary
        </label>

        <textarea
          id="resolutionSummary"
          value={resolutionSummary}
          onChange={(e) =>
            setResolutionSummary(e.target.value)
          }
          placeholder="Explain the final resolution or guidance..."
          rows={6}
          maxLength={2000}
          required
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {resolutionSummary.length}/2000
        </p>
      </div>

      <button
        type="submit"
        disabled={
          resolving ||
          !actionTaken.trim() ||
          !resolutionSummary.trim()
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resolving ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Resolving...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Resolve Complaint
          </>
        )}
      </button>
    </form>
  </section>
)}


{/* Manage Complaint */}

{complaint.assessment !== "pending" && (
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
          <option value={complaint.status}>
            {formatStatus(complaint.status)}
          </option>

          {nextStatus && (
            <option value={nextStatus}>
              {formatStatus(nextStatus)}
            </option>
          )}
        </select>
      </div>


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


      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {message && (
        <div className="flex gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            {message}
          </span>

        </div>
      )}


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
)}
        </aside>
      </div>
    </div>
  );
}

export default AdminComplaintDetails;

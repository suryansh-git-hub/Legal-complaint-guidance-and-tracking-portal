import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  FileText,
  LoaderCircle,
  MessageSquareText,
  Scale,
} from "lucide-react";

import api from "../../api/axios";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [documents, setDocuments] = useState([]);

  const [documentRequests, setDocumentRequests] =
    useState([]);

  const [selectedFiles, setSelectedFiles] =
    useState({});

  const [
    uploadingRequestId,
    setUploadingRequestId,
  ] = useState(null);

  const [uploadError, setUploadError] =
    useState("");

  const [satisfied, setSatisfied] = useState(null);

  const [feedbackComment, setFeedbackComment] =
    useState("");

  const [
    submittingFeedback,
    setSubmittingFeedback,
  ] = useState(false);

  const [feedbackError, setFeedbackError] =
    useState("");

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  /* =====================================
     FETCH COMPLAINT DETAILS
  ===================================== */

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/complaints/${id}`
        );

        setComplaint(response.data.complaint);

        setDocuments(
          response.data.documents || []
        );

        setDocumentRequests(
          response.data.documentRequests || []
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

  /* =====================================
     COMPLAINT STATUS STEPS
  ===================================== */

  const statusSteps = [
    "submitted",
    "in-progress",
    "resolved",
    "closed",
  ];

  const formatStatus = (status) => {
    return status
      ?.replaceAll("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* =====================================
     REQUESTED DOCUMENT UPLOAD
  ===================================== */

  const handleRequestedDocumentUpload = async (
    requestId
  ) => {
    const file = selectedFiles[requestId];

    if (!file) {
      setUploadError(
        "Please select a document first."
      );

      return;
    }

    try {
      setUploadingRequestId(requestId);

      setUploadError("");

      const formData = new FormData();

      formData.append("document", file);

      const response = await api.post(
        `/complaints/${id}/document-requests/${requestId}/upload`,
        formData
      );

      const uploadedDocument =
        response.data.document;

      setDocuments((previousDocuments) => [
        uploadedDocument,
        ...previousDocuments,
      ]);

      setDocumentRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "submitted",
                submittedAt:
                  new Date().toISOString(),
              }
            : request
        )
      );

      setSelectedFiles((previousFiles) => {
        const updatedFiles = {
          ...previousFiles,
        };

        delete updatedFiles[requestId];

        return updatedFiles;
      });
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload requested document"
      );
    } finally {
      setUploadingRequestId(null);
    }
  };

  /* =====================================
     FEEDBACK SUBMISSION
  ===================================== */

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (satisfied === null) {
      setFeedbackError(
        "Please select whether you are satisfied with the resolution."
      );

      return;
    }

    try {
      setSubmittingFeedback(true);

      setFeedbackError("");

      setFeedbackMessage("");

      const response = await api.post(
        `/complaints/${id}/feedback`,
        {
          satisfied,
          feedbackComment,
        }
      );

      const updatedComplaint =
        response.data.complaint;

      setComplaint(updatedComplaint);

      setSatisfied(null);

      setFeedbackComment("");

      setFeedbackMessage(
        updatedComplaint.status === "closed"
          ? "Thank you for your feedback. Your complaint has been closed."
          : "Your feedback has been submitted. The administrator can now review your concerns."
      );
    } catch (error) {
      setFeedbackError(
        error.response?.data?.message ||
          "Failed to submit feedback"
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  /* =====================================
     LOADING STATE
  ===================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading complaint details...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================
     ERROR STATE
  ===================================== */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  /* =====================================
     COMPLAINT NOT FOUND
  ===================================== */

  if (!complaint) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Complaint not found.
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(
    complaint.status
  );

  return (
    <div className="mx-auto max-w-5xl">
      {/* =====================================
          BACK BUTTON
      ===================================== */}

      <Link
        to="/complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to My Complaints
      </Link>

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Complaint Details
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {complaint.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-4 w-4" />

              Submitted on{" "}
              {new Date(
                complaint.createdAt
              ).toLocaleDateString()}
            </div>
          </div>

          <span className="inline-flex w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            {formatStatus(complaint.status)}
          </span>
        </div>
      </section>

      {/* =====================================
          PROGRESS TRACKER
      ===================================== */}

      {complaint.assessment !==
        "not-actionable" && (
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Complaint Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track the current progress of your
                complaint.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-4">
              {statusSteps.map((step, index) => {
                const completed =
                  index <= currentStep;

                return (
                  <div
                    key={step}
                    className="relative flex flex-col items-center"
                  >
                    {index !== 0 && (
                      <div
                        className={`absolute right-1/2 top-5 h-0.5 w-full ${
                          index <= currentStep
                            ? "bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-3 text-center text-xs font-medium sm:text-sm ${
                        completed
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatStatus(step)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="space-y-6 lg:col-span-2">
          {/* COMPLAINT INFORMATION */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Complaint Information
              </h2>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
                {complaint.description}
              </p>
            </div>
          </section>

          {/* =====================================
              SUPPORTING DOCUMENTS
          ===================================== */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Supporting Documents
              </h2>
            </div>

            <div className="mt-5">
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div
                      key={document._id}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/50">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {document.originalName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {(
                              document.fileSize /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <a
                        href={`${
                          import.meta.env
                            .VITE_UPLOADS_BASE_URL ||
                          "http://localhost:5000"
                        }${document.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                      >
                        View Document

                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-5 text-center dark:bg-gray-900/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No supporting documents were
                    uploaded with this complaint.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =====================================
              DOCUMENT REQUESTS
          ===================================== */}

          {documentRequests.length > 0 && (
            <section className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-900 dark:bg-gray-800">
              <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Additional Documents Required
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  The administrator has requested
                  additional information for your
                  complaint.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {documentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {request.documentName}
                        </p>

                        {request.instructions && (
                          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            {request.instructions}
                          </p>
                        )}
                      </div>

                      <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium capitalize text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {request.status}
                      </span>
                    </div>

                    {request.status === "pending" && (
                      <div className="mt-4 border-t border-amber-200 pt-4 dark:border-amber-900">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Please upload the requested
                          document so the administrator
                          can continue reviewing your
                          complaint.
                        </p>

                        <div className="mt-4">
                          <input
                            type="file"
                            onChange={(e) =>
                              setSelectedFiles(
                                (previousFiles) => ({
                                  ...previousFiles,

                                  [request._id]:
                                    e.target.files[0],
                                })
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                          />
                        </div>

                        {selectedFiles[request._id] && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Selected:{" "}
                            {
                              selectedFiles[
                                request._id
                              ].name
                            }
                          </p>
                        )}

                        {uploadError && (
                          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                            {uploadError}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRequestedDocumentUpload(
                              request._id
                            )
                          }
                          disabled={
                            uploadingRequestId ===
                              request._id ||
                            !selectedFiles[request._id]
                          }
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {uploadingRequestId ===
                          request._id ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />

                              Uploading...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />

                              Upload Document
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================
              FINAL RESOLUTION
          ===================================== */}

          {["resolved", "closed"].includes(
            complaint.status
          ) &&
            complaint.assessment !==
              "not-actionable" && (
              <section className="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-900 dark:bg-gray-800">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Final Resolution
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Your complaint has been reviewed
                      and resolved.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Action Taken
                    </p>

                    <div className="mt-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                      <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
                        {complaint.actionTaken ||
                          "No action details available."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Resolution Summary
                    </p>

                    <div className="mt-2 rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                      <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
                        {complaint.resolutionSummary ||
                          "No resolution summary available."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Resolved On
                    </p>

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(
                        complaint.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </section>
            )}

          {/* =====================================
              FEEDBACK FORM
          ===================================== */}

          {complaint.status === "resolved" &&
            complaint.satisfied === null && (
              <section className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm dark:border-blue-900 dark:bg-gray-800">
                <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Resolution Feedback
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Please let us know whether you are
                    satisfied with the resolution
                    provided.
                  </p>
                </div>

                <form
                  onSubmit={handleFeedbackSubmit}
                  className="mt-5 space-y-5"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Are you satisfied with the
                      resolution?
                    </p>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          setSatisfied(true)
                        }
                        className={`rounded-lg border px-5 py-3 text-sm font-medium transition ${
                          satisfied === true
                            ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        Yes, I am satisfied
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSatisfied(false)
                        }
                        className={`rounded-lg border px-5 py-3 text-sm font-medium transition ${
                          satisfied === false
                            ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        No, I am not satisfied
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="feedbackComment"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Feedback Comment
                    </label>

                    <textarea
                      id="feedbackComment"
                      value={feedbackComment}
                      onChange={(e) =>
                        setFeedbackComment(
                          e.target.value
                        )
                      }
                      placeholder={
                        satisfied === false
                          ? "Please explain what was not addressed..."
                          : "Add an optional comment..."
                      }
                      rows={5}
                      maxLength={1000}
                      className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-950"
                    />

                    <p className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
                      {feedbackComment.length}/1000
                    </p>
                  </div>

                  {feedbackError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                      {feedbackError}
                    </div>
                  )}

                  {feedbackMessage && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                      {feedbackMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      submittingFeedback ||
                      satisfied === null
                    }
                    className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingFeedback
                      ? "Submitting Feedback..."
                      : "Submit Feedback"}
                  </button>
                </form>
              </section>
            )}

          {/* =====================================
              UNSATISFIED FEEDBACK
          ===================================== */}

          {complaint.status === "resolved" &&
            complaint.satisfied === false && (
              <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
                <h2 className="font-semibold text-amber-800 dark:text-amber-300">
                  Feedback Submitted
                </h2>

                <p className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                  You marked this resolution as
                  unsatisfactory. The administrator can
                  review your feedback and revise the
                  resolution.
                </p>

                {complaint.feedbackComment && (
                  <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Your Comment
                    </p>

                    <p className="mt-2 whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {complaint.feedbackComment}
                    </p>
                  </div>
                )}
              </section>
            )}

          {/* =====================================
              CLOSED COMPLAINT
          ===================================== */}

          {complaint.status === "closed" &&
            complaint.satisfied === true && (
              <section className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-900 dark:bg-green-950/30">
                <h2 className="font-semibold text-green-800 dark:text-green-300">
                  Complaint Closed
                </h2>

                <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                  You marked the resolution as
                  satisfactory. This complaint is now
                  closed.
                </p>

                {complaint.feedbackComment && (
                  <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Your Feedback
                    </p>

                    <p className="mt-2 whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {complaint.feedbackComment}
                    </p>
                  </div>
                )}
              </section>
            )}

          {/* =====================================
              NOT ACTIONABLE
          ===================================== */}

          {complaint.assessment ===
            "not-actionable" && (
            <section className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-900 dark:bg-gray-800">
              <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Complaint Review Decision
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your complaint has been reviewed by
                  the administrator.
                </p>
              </div>

              <div className="mt-5">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    This complaint was marked as Not
                    Actionable.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    Based on the information and
                    supporting documents provided, no
                    further action will be taken on this
                    complaint.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =====================================
              ADMIN REMARKS
          ===================================== */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <MessageSquareText className="h-5 w-5 text-blue-600 dark:text-blue-400" />

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Legal Admin Remarks
              </h2>
            </div>

            <div className="mt-5">
              {complaint.adminRemarks ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                  <p className="leading-7 text-gray-700 dark:text-gray-300">
                    {complaint.adminRemarks}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-5 text-center dark:bg-gray-900/50">
                  <MessageSquareText className="mx-auto h-6 w-6 text-gray-400 dark:text-gray-500" />

                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    No remarks available
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Legal Admin remarks will appear here
                    when your complaint is reviewed.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =====================================
            COMPLAINT SUMMARY
        ===================================== */}

        <aside>
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />

              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Complaint Summary
              </h2>
            </div>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Current Status
                </dt>

                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatStatus(complaint.status)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Created On
                </dt>

                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Last Updated
                </dt>

                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {new Date(
                    complaint.updatedAt
                  ).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ComplaintDetails;
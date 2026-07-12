import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,ExternalLink,
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
   console.log(documents)

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/complaints/${id}`
        );

        setComplaint(response.data.complaint);
        setDocuments(response.data.documents || []);
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
 
  const statusSteps = [
    "submitted",
    "in-progress",
    "resolved",
    "closed",
  ];

  const formatStatus = (status) => {
    return status
      ?.replace("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
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

  if (error) {
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

  const currentStep = statusSteps.indexOf(
    complaint.status
  );

  return (
   
    <div className="mx-auto max-w-5xl">
      {/* Back Button */}

      <Link
        to="/complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Complaints
      </Link>

      {/* Header */}

      <section className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Complaint Details
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
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

          <span className="inline-flex w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            {formatStatus(complaint.status)}
          </span>
        </div>
      </section>

      {/* Progress Tracker */}

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Complaint Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track the current progress of your complaint.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-5">
            {statusSteps.map((step, index) => {
              const completed = index <= currentStep;

              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center"
                >
                  {/* Connecting Line */}

                  {index !== 0 && (
                    <div
                      className={`absolute right-1/2 top-5 h-0.5 w-full ${
                        index <= currentStep
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Status Circle */}

                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      completed
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
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

                  {/* Status Name */}

                  <p
                    className={`mt-3 text-center text-xs font-medium sm:text-sm ${
                      completed
                        ? "text-blue-700"
                        : "text-gray-500"
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main Complaint Information */}

        <div className="space-y-6 lg:col-span-2">
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
        {documents.map((document) => (
          
          <div
            key={document._id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
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
              </div>
            </div>
<p className="text-xs break-all text-red-600">
  {document.fileUrl}
</p>

<p className="text-xs break-all text-green-600">
  {`${import.meta.env.VITE_UPLOADS_BASE_URL}${document.fileUrl}`}
</p>
            <a
href={`${import.meta.env.VITE_UPLOADS_BASE_URL}${document.fileUrl}`}
  target="_blank"
  rel="noopener noreferrer"

              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              View Document

              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-lg bg-gray-50 p-5 text-center">
        <p className="text-sm text-gray-500">
          No supporting documents were uploaded with this complaint.
        </p>
      </div>
    )}
  </div>
</section>

          {/* Admin Remarks */}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <MessageSquareText className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                Legal Admin Remarks
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
                  <MessageSquareText className="mx-auto h-6 w-6 text-gray-400" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No remarks available
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Legal Admin remarks will appear here when
                    your complaint is reviewed.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Complaint Summary */}

        <aside>
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <Scale className="h-5 w-5 text-blue-600" />

              <h2 className="font-semibold text-gray-900">
                Complaint Summary
              </h2>
            </div>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Current Status
                </dt>

                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {formatStatus(complaint.status)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Created On
                </dt>

                <dd className="mt-1 text-sm text-gray-700">
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Last Updated
                </dt>

                <dd className="mt-1 text-sm text-gray-700">
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
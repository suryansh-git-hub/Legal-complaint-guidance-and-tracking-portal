import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import api from "../../api/axios";

function GuidanceDetails() {
  const { issueId } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/issues/${issueId}`
        );

        setIssue(response.data.issue);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load legal guidance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [issueId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading legal guidance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          Legal guidance not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Link */}

      <Link
        to={`/issues/${issue.category._id}`}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to Issues
      </Link>

      {/* Header */}

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
          {issue.title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
          {issue.description}
        </p>
      </div>

      {/* Guidance Sections */}

      <div className="mt-8 space-y-6">
        {/* Immediate Steps */}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Immediate Steps
          </h2>

          <ol className="mt-4 space-y-3">
            {issue.immediateSteps?.map(
              (step, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-gray-600 dark:text-gray-300"
                >
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}.
                  </span>

                  <span>{step}</span>
                </li>
              )
            )}
          </ol>
        </section>

        {/* Required Documents */}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Required Documents
          </h2>

          <ul className="mt-4 space-y-3">
            {issue.requiredDocuments?.map(
              (document, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-gray-600 dark:text-gray-300"
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    ✓
                  </span>

                  <span>{document}</span>
                </li>
              )
            )}
          </ul>
        </section>

        {/* Complaint Procedure */}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Complaint Procedure
          </h2>

          <ol className="mt-4 space-y-3">
            {issue.complaintSteps?.map(
              (step, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-gray-600 dark:text-gray-300"
                >
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}.
                  </span>

                  <span>{step}</span>
                </li>
              )
            )}
          </ol>
        </section>
      </div>

      {/* Create Complaint CTA */}

      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Need to submit a complaint?
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Create a complaint related to this legal issue and
          track its progress through NyayaPath.
        </p>

        <Link
          to={`/complaints/new?issueId=${issue._id}`}
          className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Create Complaint
        </Link>
      </div>
    </div>
  );
}

export default GuidanceDetails;
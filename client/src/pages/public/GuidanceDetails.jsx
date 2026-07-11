import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, } from "react-router-dom";

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
    return <p>Loading legal guidance...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!issue) {
    return <p>Legal guidance not found.</p>;
  }

 return (
  <div className="mx-auto max-w-4xl">
    <Link
      to={`/issues/${issue.category}`}
      className="text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      ← Back to Issues
    </Link>

    <div className="mt-6">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
        {issue.title}
      </h1>

      <p className="mt-4 text-lg leading-8 text-gray-600">
        {issue.description}
      </p>
    </div>

    <div className="mt-8 space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Immediate Steps
        </h2>

        <ol className="mt-4 space-y-3">
          {issue.immediateSteps?.map((step, index) => (
            <li
              key={index}
              className="flex gap-3 text-gray-600"
            >
              <span className="font-semibold text-blue-600">
                {index + 1}.
              </span>

              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Required Documents
        </h2>

        <ul className="mt-4 space-y-3">
          {issue.requiredDocuments?.map(
            (document, index) => (
              <li
                key={index}
                className="flex gap-3 text-gray-600"
              >
                <span className="text-blue-600">✓</span>
                <span>{document}</span>
              </li>
            )
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Complaint Procedure
        </h2>

        <ol className="mt-4 space-y-3">
          {issue.complaintProcedure?.map((step, index) => (
            <li
              key={index}
              className="flex gap-3 text-gray-600"
            >
              <span className="font-semibold text-blue-600">
                {index + 1}.
              </span>

              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>

    <div className="mt-8 rounded-xl bg-blue-50 p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Need to submit a complaint?
      </h2>

      <p className="mt-2 text-gray-600">
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
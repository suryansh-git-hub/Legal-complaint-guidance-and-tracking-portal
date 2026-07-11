import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/axios";

function Issues() {
  const { categoryId } = useParams();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/issues/category/${categoryId}`
        );

        setIssues(response.data.issues);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load issues"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [categoryId]);

  if (loading) {
    return <p>Loading issues...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  <div>
    <Link
      to="/categories"
      className="text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      ← Back to Categories
    </Link>

    <div className="mt-6 mb-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Legal Issues
      </h1>

      <p className="mt-3 text-gray-600">
        Select the issue that best matches your situation.
      </p>
    </div>

    {issues.length === 0 ? (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">
          No legal issues found for this category.
        </p>
      </div>
    ) : (
      <div className="grid gap-5 md:grid-cols-2">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {issue.title}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {issue.description}
            </p>

            <Link
              to={`/guidance/${issue._id}`}
              className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              View Legal Guidance
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Issues;
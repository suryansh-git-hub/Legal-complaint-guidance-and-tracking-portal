import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading legal issues...
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

  return (
    <div>
      {/* Back Link */}

      <Link
        to="/categories"
        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to Categories
      </Link>

      {/* Header */}

      <div className="mb-10 mt-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Legal Issues
        </h1>

        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Select the issue that best matches your situation.
        </p>
      </div>

      {/* Issues */}

      {issues.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">
            No legal issues found for this category.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {issue.title}
              </h2>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
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
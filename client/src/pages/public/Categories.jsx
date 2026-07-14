import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import api from "../../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/categories");

        setCategories(response.data.categories);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading categories...
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
      {/* Header */}

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
          Legal Guidance
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          Select the category that best matches your legal
          issue to find useful information and guidance.
        </p>
      </div>

      {/* Categories */}

      {categories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">
            No legal categories are currently available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {category.name}
              </h2>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                {category.description}
              </p>

              <Link
                to={`/issues/${category._id}`}
                className="mt-5 inline-block font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Legal Issues →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

return (
  <div>
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
        Legal Guidance
      </h1>

      <p className="mx-auto mt-3 max-w-2xl text-gray-600">
        Select the category that best matches your legal
        issue to find useful information and guidance.
      </p>
    </div>

    {loading ? (
      <p className="text-center text-gray-600">
        Loading categories...
      </p>
    ) : error ? (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {category.name}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {category.description}
            </p>

            <Link
              to={`/issues/${category._id}`}
              className="mt-5 inline-block font-medium text-blue-600 hover:text-blue-700"
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
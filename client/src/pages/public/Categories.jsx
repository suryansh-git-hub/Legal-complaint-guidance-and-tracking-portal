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
      <h1>Legal Categories</h1>

      <p>
        Select the category that best matches your legal issue.
      </p>

      <div>
        {categories.map((category) => (
          <div key={category._id}>
            <h2>{category.name}</h2>

            <p>{category.description}</p>

            <Link to={`/issues/${category._id}`}>
              View Issues
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
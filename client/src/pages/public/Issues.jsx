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
      <h1>Legal Issues</h1>

      <p>
        Select the issue that best matches your situation.
      </p>

      {issues.length === 0 ? (
        <p>No issues found for this category.</p>
      ) : (
        <div>
          {issues.map((issue) => (
            <div key={issue._id}>
              <h2>{issue.title}</h2>

              <p>{issue.description}</p>

              <Link to={`/guidance/${issue._id}`}>
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
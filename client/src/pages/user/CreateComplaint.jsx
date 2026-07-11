import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../../api/axios";

function CreateComplaint() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const issueId = searchParams.get("issueId");

  const [issue, setIssue] = useState(null);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [issueLoading, setIssueLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId) {
        setIssueLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/issues/${issueId}`
        );

        setIssue(response.data.issue);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load selected issue"
        );
      } finally {
        setIssueLoading(false);
      }
    };

    fetchIssue();
  }, [issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueId) {
      setError(
        "Please select a legal issue before creating a complaint."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/complaints", {
        issue: issueId,
  title: issue.title,
  description,
      });

      navigate("/complaints");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  if (issueLoading) {
    return <p>Loading selected issue...</p>;
  }

  if (!issueId) {
    return (
      <div>
        <h1>Create Complaint</h1>

        <p>
          Please select a legal issue before creating
          a complaint.
        </p>

        <Link to="/categories">
          Browse Legal Guidance
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Create Complaint</h1>

      {error && <p>{error}</p>}

      {issue && (
        <div>
          <h2>Selected Legal Issue</h2>

          <h3>{issue.title}</h3>

          <p>{issue.description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Complaint Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your complaint in detail"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default CreateComplaint;
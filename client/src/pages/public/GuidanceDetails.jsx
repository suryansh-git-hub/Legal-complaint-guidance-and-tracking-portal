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
    <div>
      <h1>{issue.title}</h1>

      <p>{issue.description}</p>

      <section>
        <h2>Immediate Steps</h2>

        {issue.immediateSteps?.map((step, index) => (
          <p key={index}>
            {index + 1}. {step}
          </p>
        ))}
      </section>

      <section>
        <h2>Required Documents</h2>

        {issue.requiredDocuments?.map(
          (document, index) => (
            <p key={index}>
              {index + 1}. {document}
            </p>
          )
        )}
      </section>

      <section>
        <h2>Complaint Procedure</h2>

        {issue.complaintProcedure?.map(
          (step, index) => (
            <p key={index}>
              {index + 1}. {step}
            </p>
          )
        )}
      </section>

      <div>
  <Link to={`/complaints/new?issueId=${issue._id}`}>
    Create Complaint for this Issue
  </Link>
</div>
    </div>
  );
}

export default GuidanceDetails;
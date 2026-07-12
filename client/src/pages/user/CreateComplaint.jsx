import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,FileText,LoaderCircle,Scale, Send,Info,X,FileUp
} from "lucide-react";

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

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId) {
        setIssueLoading(false);
        return;
      }

      try {
        setError("");

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

 const handleDocumentChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  const invalidFile = selectedFiles.find(
    (file) => !allowedTypes.includes(file.type)
  );

  if (invalidFile) {
    setError(
      "Only PDF, JPG, JPEG, and PNG files are allowed."
    );
    e.target.value = "";
    return;
  }

  const oversizedFile = selectedFiles.find(
    (file) => file.size > 5 * 1024 * 1024
  );

  if (oversizedFile) {
    setError(
      "Each document must be 5 MB or smaller."
    );
    e.target.value = "";
    return;
  }

  if (documents.length + selectedFiles.length > 5) {
    setError(
      "You can upload a maximum of 5 documents."
    );
    e.target.value = "";
    return;
  }

  setError("");

  setDocuments((previous) => [
    ...previous,
    ...selectedFiles,
  ]);

  e.target.value = "";
};

const removeDocument = (indexToRemove) => {
  setDocuments((previous) =>
    previous.filter(
      (_, index) => index !== indexToRemove
    )
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueId || !issue) {
      setError(
        "Please select a legal issue before creating a complaint."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      // await api.post("/complaints", {
      //   issue: issueId,
      //   title: issue.title,
      //   description,
      // });

      const formData = new FormData();

formData.append("issue", issueId);
formData.append("title", issue.title);
formData.append("description", description);

documents.forEach((document) => {
  formData.append("documents", document);
});

await api.post("/complaints", formData);
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading selected legal issue...
          </p>
        </div>
      </div>
    );
  }

  if (!issueId || !issue) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Scale className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Select a Legal Issue
          </h1>

          <p className="mx-auto mt-3 max-w-md text-gray-600">
            A complaint must be connected to a legal issue.
            Browse Legal Guidance and select the issue that
            matches your situation.
          </p>

          <Link
            to="/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Browse Legal Guidance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Link */}

      <Link
        to={`/guidance/${issueId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Legal Guidance
      </Link>

      {/* Header */}

      <section className="mt-6">
        <p className="text-sm font-medium text-blue-600">
          Complaint Submission
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Create Complaint
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Provide complete and accurate information about
          your complaint. You will be able to track its
          progress after submission.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Selected Issue */}

        <aside>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Selected Legal Issue
            </p>

            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              {issue.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {issue.description}
            </p>

            <Link
              to="/categories"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Change Legal Issue
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <p className="text-sm leading-6 text-blue-800">
                Describe your complaint clearly and include
                relevant facts that may help the Legal Admin
                understand your situation.
              </p>
            </div>
          </div>
        </aside>

        {/* Complaint Form */}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <FileText className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Complaint Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the details of your complaint.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6"
          >
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Complaint Description
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Explain what happened and provide relevant
                details.
              </p>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your complaint in detail..."
                required
                rows={10}
                className="mt-3 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

                  <div className="mt-6">
  <label className="block text-sm font-medium text-gray-700">
    Supporting Documents
  </label>

  <p className="mt-1 text-xs text-gray-500">
    Optionally upload invoices, receipts, screenshots,
    photographs, or other supporting proof.
  </p>

  <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
    <FileUp className="h-8 w-8 text-gray-400" />

    <span className="mt-3 text-sm font-medium text-gray-700">
      Select supporting documents
    </span>

    <span className="mt-1 text-xs text-gray-500">
      PDF, JPG, JPEG or PNG • Maximum 5 files • 5 MB each
    </span>

    <input
      type="file"
      multiple
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={handleDocumentChange}
      className="hidden"
    />
  </label>

  {documents.length > 0 && (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Selected Documents ({documents.length}/5)
      </p>

      {documents.map((document, index) => (
        <div
          key={`${document.name}-${index}`}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-blue-600" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-700">
                {document.name}
              </p>

              <p className="text-xs text-gray-500">
                {(document.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeDocument(index)}
            className="ml-4 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${document.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
              <Link
                to={`/guidance/${issueId}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CreateComplaint;
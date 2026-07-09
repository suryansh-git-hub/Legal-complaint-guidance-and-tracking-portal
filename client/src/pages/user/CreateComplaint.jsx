import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

function CreateComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

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

  return (
    <div>
      <h1>Create Complaint</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Complaint Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter complaint title"
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your complaint"
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Submitting Complaint..."
            : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default CreateComplaint;
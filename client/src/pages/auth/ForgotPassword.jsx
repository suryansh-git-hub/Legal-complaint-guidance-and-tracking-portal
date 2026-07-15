import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LoaderCircle,
  Mail,
} from "lucide-react";

import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

function ForgotPassword() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl border p-8 shadow-sm transition-colors duration-300 ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              theme === "dark"
                ? "bg-blue-900/30"
                : "bg-blue-50"
            }`}
          >
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          <h1
            className={`mt-5 text-2xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Forgot Password?
          </h1>

          <p
            className={`mt-2 text-sm leading-6 ${
              theme === "dark"
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            Enter your registered email address and we will
            send you a link to reset your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                theme === "dark"
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your registered email"
              required
              className={`mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
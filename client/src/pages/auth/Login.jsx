import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(
        formData.email,
        formData.password
      );

console.log("LOGGED IN USER:", loggedInUser);
console.log("ROLE:", loggedInUser.role);

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div>
  //     <h1>Login</h1>

  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>Email</label>

  //         <input
  //           type="email"
  //           name="email"
  //           value={formData.email}
  //           onChange={handleChange}
  //           placeholder="Enter your email"
  //         />
  //       </div>

  //       <div>
  //         <label>Password</label>

  //         <input
  //           type="password"
  //           name="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           placeholder="Enter your password"
  //         />
  //       </div>

  //       {error && <p>{error}</p>}

  //       <button
  //         type="submit"
  //         disabled={loading}
  //       >
  //         {loading ? "Logging in..." : "Login"}
  //       </button>
  //     </form>

  //     <p>
  //       Don't have an account?{" "}
  //       <Link to="/register">
  //         Create Account
  //       </Link>
  //     </p>
  //   </div>
  // );

  return (
  <div className="flex min-h-[75vh] items-center justify-center">
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Login to access your NyayaPath account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
          <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    Forgot Password?
  </Link>
</div>
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Create Account
        </Link>
      </p>
    </div>
  </div>
);

}

export default Login;

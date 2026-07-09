import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav>
      <Link to="/">
        <h2>NyayaPath</h2>
      </Link>

      <div>
        <Link to="/">Home</Link>
        <Link to="/categories"> Legal Guidance </Link>

        {!user && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

        {user && user.role === "user" && (
          <Link to="/dashboard">
            Dashboard
          </Link>
        )}

        {user && user.role === "admin" && (
          <Link to="/admin/dashboard">
            Admin Dashboard
          </Link>
        )}

        {user && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { Menu, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      setIsMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const linkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}

          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-blue-600"
          >
            NyayaPath
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              className={linkStyle}
            >
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className={linkStyle}
            >
              Legal Guidance
            </NavLink>

            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={linkStyle}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}

            {user?.role === "user" && (
              <>
                <NavLink
                  to="/dashboard"
                  className={linkStyle}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/complaints"
                  className={linkStyle}
                >
                  My Complaints
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={linkStyle}
                >
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/admin/complaints"
                  className={linkStyle}
                >
                  All Complaints
                </NavLink>
              </>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                onClick={closeMenu}
                className={linkStyle}
              >
                Home
              </NavLink>

              <NavLink
                to="/categories"
                onClick={closeMenu}
                className={linkStyle}
              >
                Legal Guidance
              </NavLink>

              {!user && (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={linkStyle}
                  >
                    Login
                  </NavLink>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={closeMenu}
                    className={linkStyle}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/complaints"
                    onClick={closeMenu}
                    className={linkStyle}
                  >
                    My Complaints
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    onClick={closeMenu}
                    className={linkStyle}
                  >
                    Admin Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/complaints"
                    onClick={closeMenu}
                    className={linkStyle}
                  >
                    All Complaints
                  </NavLink>
                </>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

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
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white transition-colors dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}

          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-blue-600 dark:text-blue-500"
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

            {/* Theme Button */}

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (previous) => !previous
              )
            }
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
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
          <div className="border-t border-gray-200 py-4 dark:border-gray-700 md:hidden">
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
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
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

              {/* Mobile Theme Button */}

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-5 w-5" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-5 w-5" />
                    Light Mode
                  </>
                )}
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 dark:border-red-400 dark:text-red-400"
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
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Understand Your Legal Rights.
            <span className="block text-blue-600">
              Take the Right Action.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            NyayaPath helps you understand common legal
            issues, find useful guidance, submit complaints,
            and track their progress.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/categories"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Explore Legal Guidance
            </Link>

            {!user && (
              <Link
                to="/register"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Create Account
              </Link>
            )}

            {user?.role === "user" && (
              <Link
                to="/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            How NyayaPath Helps You
          </h2>

          <p className="mt-3 text-gray-600">
            Simple tools to understand legal issues and
            manage your complaints.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Legal Guidance
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Browse legal categories, select your issue,
              and understand the steps you can take.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Submit Complaints
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Create complaints based on your selected legal
              issue and manage them from your dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Track Progress
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Check complaint status updates and read remarks
              provided by the Legal Admin.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="rounded-2xl bg-blue-50 px-6 py-12">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How It Works
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                01
              </p>

              <h3 className="mt-3 font-semibold">
                Select Category
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Choose the legal category related to your
                problem.
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                02
              </p>

              <h3 className="mt-3 font-semibold">
                Read Guidance
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Understand the legal issue and recommended
                steps.
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                03
              </p>

              <h3 className="mt-3 font-semibold">
                Submit Complaint
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Create and submit your complaint securely.
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                04
              </p>

              <h3 className="mt-3 font-semibold">
                Track Progress
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                View status updates and Legal Admin remarks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
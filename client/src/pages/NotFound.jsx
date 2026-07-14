import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
          <SearchX className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Error 404
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600 dark:text-gray-400">
          The page you are looking for does not exist, may
          have been removed, or the address may be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
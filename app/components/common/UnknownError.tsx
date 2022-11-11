import { Link } from "@remix-run/react";

export const UnknownError = ({ error }: { error?: Error }) => {
  return (
    <div className="mt-18 mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="-mb-4">
        <span className="text-[256px] font-bold text-gray-200">Error</span>
      </div>
      <h1 className="mb-6">Nothing to see here</h1>
      <p className="mb-12 max-w-xl text-lg text-gray-500">
        Our servers could not handle your request. Don't worry, our development
        team was already notified. Try refreshing the page.
      </p>
      <div>
        <div>
          <Link to="/" className="font-medium text-indigo-700">
            Take me back to the home page
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-left text-sm">
            <p className="border-t border-gray-200 pt-4 text-center text-lg font-medium text-red-600">
              Development Only
            </p>
            <p className="font-bold">
              Error: <span className="font-normal">{error?.name}</span>
            </p>
            <p className="font-bold">
              Message: <span className="font-normal">{error?.message}</span>
            </p>
            <pre className="mt-2 rounded bg-gray-200 p-3">
              <code>{error?.stack}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

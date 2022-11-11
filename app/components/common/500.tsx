import { Link } from "@remix-run/react";

export const Page500 = () => {
  return (
    <div className="mt-18 mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="-mb-4">
        <span className="text-[256px] font-bold text-gray-200">500</span>
      </div>
      <h1 className="mb-6">Something bad just happened...</h1>
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
      </div>
    </div>
  );
};

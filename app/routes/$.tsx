import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "~/components/common";

export const loader: LoaderFunction = ({ params }) => {
  return json({ params: params["*"] });
};

export default function Page404() {
  const { params } = useLoaderData();
  console.log(params);
  return (
    <div className="mt-18 mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="-mb-4">
        <span className="text-[256px] font-bold text-gray-200">404</span>
      </div>
      <h1 className="mb-6">You have found a secret place.</h1>
      <p className="mb-12 max-w-xl text-lg text-gray-500">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </p>
      <div>
        <div>
          <Link to="/">Take me back to the home page</Link>
        </div>
      </div>
    </div>
  );
}

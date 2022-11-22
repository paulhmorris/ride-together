import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useCatch } from "@remix-run/react";
import { Page404, Page500, UnknownError } from "~/components/common";
import { requireUserId } from "~/lib/session.server";
import { classNames, useUser } from "~/lib/utils";

const accountTabs = [
  { title: "Overview", path: "/account" },
  { title: "Clubs", path: "/account/clubs" },
  { title: "Past Rides", path: "/account/past-rides" },
  { title: "Settings", path: "/account/settings" },
];

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  return json({ userId });
};

export default function Account() {
  const user = useUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl sm:text-5xl">
          {user.firstName} {user.lastName}
        </h1>
        <p className="pl-1 text-gray-500">{user.email}</p>
      </div>
      <nav className="mb-4 flex gap-4 border-b border-gray-200 pb-2">
        {accountTabs.map(({ path, title }) => (
          <NavLink
            end
            key={path}
            to={path}
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-rose-100 text-rose-800"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                "inline-flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition duration-75 focus:outline-none focus-visible:outline-none"
              )
            }
          >
            {title}
          </NavLink>
        ))}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const { status } = useCatch();
  return status === 404 ? (
    <Page404 />
  ) : status === 500 ? (
    <Page500 />
  ) : (
    <UnknownError />
  );
}

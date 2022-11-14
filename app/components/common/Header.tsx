import { FireIcon } from "@heroicons/react/24/solid";
import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/lib/utils";

export function Header() {
  const user = useOptionalUser();

  return (
    <header className="fixed inset-x-0 top-0 z-10 h-24 w-full bg-white px-8 py-6 text-base font-medium">
      <div className="mx-auto grid max-w-[1200px] auto-cols-[1fr] grid-cols-[0.5fr_1fr_0.5fr] items-center justify-between gap-4">
        <Link to="/" className="group">
          <h1 className="flex items-center gap-2 whitespace-nowrap text-2xl font-black uppercase">
            <FireIcon className="h-8 w-8 transition delay-500 duration-500 group-hover:text-red-700" />{" "}
            ride together
          </h1>
        </Link>
        <nav className="flex justify-center gap-8">
          <Link to="/rides" className="p-3 hover:text-rose-800">
            Rides
          </Link>
          <Link to="/clubs" className="p-3 hover:text-rose-800">
            Clubs
          </Link>
          <Link to="/clubs" className="p-3 hover:text-rose-800">
            Shop
          </Link>
        </nav>
        <nav className="flex items-center justify-end gap-8">
          {user ? (
            <>
              <Link to={`/users/${user.id}`}>{user.email}</Link>
              <Form action="/logout" method="post">
                <button type="submit">Logout</button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link
                to="/join"
                className="rounded-md bg-rose-800 py-3 px-5 font-medium text-white transition-colors duration-100 hover:opacity-95"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

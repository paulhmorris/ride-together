import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/lib/utils";

export function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex items-center bg-slate-700 p-8 text-white shadow">
      <Link to="/">
        <h1 className="font-mono text-base">ride-together</h1>
      </Link>
      <nav className="ml-auto">
        {user ? (
          <div className="flex gap-8">
            <p>{user.email}</p>
            <Form action="/logout" method="post">
              <button type="submit">Logout</button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

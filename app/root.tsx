import type { User } from "@prisma/client";
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Button, Link } from "./components";

import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}

const Footer = () => {
  const { user } = useLoaderData<{ user: User | null }>();
  return (
    <footer className="fixed inset-x-0 bottom-4 text-center text-sm text-gray-500">
      {user ? (
        <div className="flex justify-center">
          <span>
            {user.email} | {user.role.toLowerCase()} |
          </span>
          <Form action="/logout" method="post">
            <Button className="ml-1" variant="link" type="submit">
              Logout
            </Button>
          </Form>
        </div>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </footer>
  );
};

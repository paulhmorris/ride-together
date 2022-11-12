import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch } from "@remix-run/react";
import { Page404, Page500, UnknownError } from "~/components/common";
import { Document } from "./components/Document";
import { RootLayout } from "./components/layouts/RootLayout";

import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

// @ts-expect-error this doesn't like the crossOrigin boolean
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Ride Together",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <Document>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Document>
  );
}

export function CatchBoundary() {
  const { status } = useCatch();
  return (
    <Document>
      <RootLayout>
        {status === 404 ? (
          <Page404 />
        ) : status === 500 ? (
          <Page500 />
        ) : (
          <UnknownError />
        )}
      </RootLayout>
    </Document>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <Document>
      <RootLayout>
        <UnknownError error={error} />
      </RootLayout>
    </Document>
  );
};

import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <Link to="/rides">View rides</Link>
          <Link to="/clubs">View clubs</Link>
        </div>
      </div>
    </main>
  );
}

import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="mx-auto flex flex-grow flex-col px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Lorem ipsum dolor sit amet.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-xl">
          The only platform for bike clubs. Find a group to ride with, join a
          club, or start your own.
        </p>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/clubs"
          className="block rounded-md bg-rose-100 py-4 px-8 font-semibold text-rose-800 transition-colors duration-100 hover:bg-rose-100"
        >
          Join a club
        </Link>
        <Link
          to="/rides"
          className="block rounded-md bg-rose-800 py-4 px-8 font-semibold text-white transition-colors duration-100 hover:opacity-90"
        >
          Find a ride
        </Link>
      </div>
    </main>
  );
}

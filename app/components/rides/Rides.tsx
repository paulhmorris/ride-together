import { HeartIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import type { RideWithClubAndRiders } from "~/routes/rides";
import { Ride } from ".";

export function Rides({ rides }: RideWithClubAndRiders) {
  if (rides === null) {
    return (
      <p className="mt-12 text-lg text-gray-500">
        No rides were found in your area. Want to{" "}
        <Link to="/rides/new" className="font-bold text-indigo-600">
          start one instead?
        </Link>
      </p>
    );
  }

  if (rides.length === 0) {
    return (
      <p className="mt-12 text-center text-lg text-gray-500">
        Type in a zipcode or use your location to find nearby rides. <br />
        <span className="inline-flex items-center">
          Your location data will not be stored or sold{" "}
          <HeartIcon className="ml-1 inline h-4 w-4" />
        </span>
      </p>
    );
  }

  return (
    <ul className="w-full max-w-4xl space-y-4">
      {rides.map((ride) => (
        <Ride key={ride.id} ride={ride} />
      ))}
    </ul>
  );
}

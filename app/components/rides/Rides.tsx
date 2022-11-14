import { HeartIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import type { RideWithClubAndRiders } from "~/routes/rides";
import { Ride } from ".";

export function Rides({ rides }: { rides: Array<RideWithClubAndRiders> }) {
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
          Your location data is not stored or sold{" "}
          <HeartIcon className="ml-1 inline h-4 w-4" />
        </span>
      </p>
    );
  }

  return (
    <ul className="grid w-full gap-8 sm:grid-cols-3">
      {rides.map((ride) => (
        <Ride key={ride.id} ride={ride} />
      ))}
    </ul>
  );
}

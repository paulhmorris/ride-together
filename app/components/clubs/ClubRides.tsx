import type { Club, Ride } from "@prisma/client";
import { Link } from "@remix-run/react";
import { formatAsDateWithTime } from "~/lib/formatters";

export function ClubRides({ club }: { club: Club & { rides: Ride[] } }) {
  return (
    <ul className="space-y-4">
      <h2 className="text-gray-600">Upcoming Rides</h2>
      {club.rides.length > 0 ? (
        club.rides.map((ride) => {
          return (
            <li
              key={ride.id}
              className="grid grid-cols-12 rounded-md border border-neutral-200 bg-white py-4 px-8 text-sm text-gray-600 shadow"
            >
              <h3 className="col-span-4">{ride.name}</h3>
              <p className="col-span-4">
                {formatAsDateWithTime(ride.startsAt)}
              </p>
              <p className="col-span-2">{ride.distance}mi</p>
              <Link
                to={`/rides/${ride.id}`}
                className="col-span-2 text-gray-500"
              >
                Info
              </Link>
            </li>
          );
        })
      ) : (
        <p className="text-gray-400">
          No rides scheduled. Check back later! 🚲
        </p>
      )}
    </ul>
  );
}

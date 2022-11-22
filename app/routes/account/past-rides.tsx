import type { Club, Ride } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatAsDateWithTime } from "~/lib/formatters";
import { requireUserId } from "~/lib/session.server";
import { getPastRidesByUser } from "~/models/ride.server";

type LoaderData = {
  rides: (Ride & { club: Club | null })[];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const rides = await getPastRidesByUser(userId);

  return json<LoaderData>({ rides });
};

export default function AccountPastRides() {
  const { rides } = useLoaderData<LoaderData>();
  return (
    <div>
      <h2>Past Rides</h2>
      <ul>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride.id}>
              <p>{formatAsDateWithTime(ride.startsAt)}</p>
              {ride.duration && <p>{ride.duration / 60.0}hr</p>}
              {ride.distance && <p>{ride.distance}mi</p>}
              {ride.club && <p>{ride.club.name}</p>}
              <Link to={`/rides/${ride.id}`}>Info</Link>
            </li>
          ))
        ) : (
          <p className="text-gray-400">You haven't been on any rides yet!</p>
        )}
      </ul>
    </div>
  );
}

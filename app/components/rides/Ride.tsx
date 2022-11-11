import type { Club, Ride as RideType, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { formatAsDateWithTime } from "~/lib/formatters";
import { useOptionalUser } from "~/lib/utils";
import { Button } from "../common";

export const Ride = ({
  ride,
}: {
  ride: RideType & {
    club: Club | null;
    riders: User[];
  };
}) => {
  const fetcher = useFetcher();
  const user = useOptionalUser();

  const rideJoined = user && ride.riders.some((s) => s.id === user.id);
  return (
    <li
      key={ride.id}
      className="grid grid-cols-12 rounded-md border border-neutral-200 bg-white py-4 px-8 text-sm text-gray-600 shadow"
    >
      <p className="col-span-3 font-bold">{ride.name}</p>
      <p className="col-span-3">{formatAsDateWithTime(ride.startsAt)}</p>
      <p className="col-span-1">{ride.distance}mi</p>
      <p className="col-span-2">{ride.club?.name ?? "No club"}</p>
      <Link to={`/rides/${ride.id}`} className="col-span-1 text-gray-500">
        Info
      </Link>
      <div className="col-span-2">
        {user ? (
          <fetcher.Form method="post" action="/rides/join-ride">
            <input type="hidden" name="rideId" value={ride.id} />
            <input
              type="hidden"
              name="_action"
              value={rideJoined ? "leave" : "join"}
            />
            <Button type="submit" className="w-full" variant="link">
              {rideJoined ? "Leave" : "Join"}
            </Button>
          </fetcher.Form>
        ) : (
          <Link
            to="/join?redirectTo=/rides"
            className="font-semibold hover:text-rose-800"
          >
            Sign up to join
          </Link>
        )}
      </div>
    </li>
  );
};

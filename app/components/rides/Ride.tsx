import { Transition } from "@headlessui/react";
import { Link, useFetcher } from "@remix-run/react";
import { Fragment } from "react";
import { convertKmToMiles, formatNumber } from "~/lib/formatters";
import { useOptionalUser } from "~/lib/utils";
import type { RideWithClubAndRiders } from "~/routes/rides";
import { Button } from "../common";

export const Ride = ({ ride }: { ride: RideWithClubAndRiders }) => {
  const fetcher = useFetcher();
  const user = useOptionalUser();

  const rideJoined = user && ride.riders.some((s) => s.id === user.id);
  return (
    <Transition
      as={Fragment}
      appear={true}
      show={true}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <li
        key={ride.id}
        className="flex max-w-lg flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-sm shadow transition"
      >
        <div className="bg-gradient-to-br from-rose-300 p-8">
          <h2 className="text-3xl font-bold">{ride.name}</h2>
          {ride.kmAway && (
            <>
              <p className="mt-1 text-lg font-medium">
                {`${formatNumber(ride.kmAway)}km away`}
              </p>
              <p>{`${formatNumber(convertKmToMiles(ride.kmAway))}mi away`}</p>
            </>
          )}
          {/* {ride.description && <p>{ride.description}</p>} */}
        </div>
        <div className="px-8 pt-6">
          {ride.description && (
            <p className="h-[3.75rem] truncate leading-5">{ride.description}</p>
          )}
        </div>
        <div className="col-span-2 mt-12 px-8 pb-6">
          {user ? (
            <fetcher.Form method="post" action="/rides/join-ride">
              <input type="hidden" name="rideId" value={ride.id} />
              <input
                type="hidden"
                name="_action"
                value={rideJoined ? "leave" : "join"}
              />
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={`/rides/${ride.id}`}
                  className="inline-flex w-full select-none items-center justify-center rounded-md border border-transparent border-rose-800 bg-white px-4 py-3 text-base font-medium text-rose-800 shadow-sm transition duration-75 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-offset-2 enabled:hover:bg-rose-700 disabled:opacity-40"
                >
                  Info
                </Link>
                <Button
                  type="submit"
                  className="w-full"
                  variant="primary"
                  disabled={rideJoined}
                >
                  Join
                </Button>
              </div>
            </fetcher.Form>
          ) : (
            <Link
              to="/join?redirectTo=/rides"
              className="inline-flex w-full select-none items-center justify-center rounded-md border border-transparent border-indigo-600 bg-white px-4 py-3 text-base font-medium text-indigo-600 shadow-sm transition duration-75 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 enabled:hover:bg-indigo-600 disabled:opacity-40"
            >
              Sign up to join
            </Link>
          )}
        </div>
      </li>
    </Transition>
  );
};

// eslint-disable-next-line no-lone-blocks
{
  /* <p className="col-span-3 font-bold">{ride.name}</p>
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
</div> */
}

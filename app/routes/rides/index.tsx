import type { Club, Ride, User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, Response } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Link } from "~/components/common";
import { prisma } from "~/db.server";
import { formatAsDateWithTime } from "~/lib/formatters";
import { useOptionalUser } from "~/lib/utils";
import { joinRide, leaveRide } from "~/models/ride.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  rides: (Ride & {
    riders: User[];
    creator: User;
    club: Club | null;
  })[];
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const rideId = formData.get("rideId");
  const action = formData.get("_action");

  if (typeof rideId !== "string" || rideId.length === 0) {
    return json(
      { errors: { rideId: "rideId is required", body: null } },
      { status: 400 }
    );
  }
  if (typeof action !== "string" || action.length === 0) {
    return json(
      { errors: { action: "Action is required", body: null } },
      { status: 400 }
    );
  }

  if (action === "join") {
    const ride = await joinRide(userId, rideId);
    return new Response(`Ride ${ride.id} joined`, { status: 201 });
  }

  if (action === "leave") {
    const ride = await leaveRide(userId, rideId);
    return new Response(`Ride ${ride.id} left`, { status: 201 });
  }
};

export const loader: LoaderFunction = async () => {
  const rides = await prisma.ride.findMany({
    include: { creator: true, riders: true, club: true },
  });
  return json<LoaderData>({ rides });
};

export default function RidePage() {
  const { rides } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const user = useOptionalUser();

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-12">Find a group ride</h1>
      <ul className="w-full max-w-4xl space-y-4">
        {rides.map((ride) => {
          const rideJoined = user && ride.riders.some((s) => s.id === user.id);
          return (
            <li
              key={ride.id}
              className="grid grid-cols-12 rounded-md border border-neutral-200 bg-white py-4 px-8 text-sm text-gray-600 shadow"
            >
              <p className="col-span-3 font-bold">{ride.name}</p>
              <p className="col-span-3">
                {formatAsDateWithTime(ride.startsAt)}
              </p>
              <p className="col-span-1">{ride.distance}mi</p>
              <p className="col-span-2">{ride.club?.name ?? "No club"}</p>
              <Link
                to={`/rides/${ride.id}`}
                className="col-span-1 text-gray-500"
              >
                Info
              </Link>
              <div className="col-span-2">
                {user ? (
                  <fetcher.Form method="post">
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
                  <Link to="/join">Sign up to join</Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

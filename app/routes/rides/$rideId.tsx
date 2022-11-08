import type { Ride } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

type LoaderData = {
  ride: Ride;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.rideId, "Expected rideId parameter");
  const ride = await prisma.ride.findFirst({ where: { id: params.rideId } });

  if (!ride) {
    throw new Response("Ride not found", { status: 404 });
  }

  return json<LoaderData>({ ride });
};

export default function RidePage() {
  const { ride } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Ride Page</h1>
      <p>Viewing ride {ride.id}</p>
    </div>
  );
}

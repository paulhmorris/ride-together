import type { Club, Ride, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { Page404, Page500, UnknownError } from "~/components/common";
import { Rides, RidesHeader } from "~/components/rides";
import { prisma } from "~/db.server";
import { getNearbyRides } from "~/models/ride.server";

export type RideWithClubAndRiders = Ride & {
  /** kmAway comes from the raw PostGIS query */
  kmAway: number | undefined;
  club: Club | null;
  riders: User[];
};

type LoaderData = { rides: Array<RideWithClubAndRiders> };

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const longitude = url.searchParams.get("longitude") ?? null;
  const latitude = url.searchParams.get("latitude") ?? null;
  const radius = url.searchParams.get("radius") ?? null;
  console.log({ longitude, latitude, radius });

  if (!longitude || !latitude) return json({ rides: [] });

  if (typeof longitude === "string" && typeof latitude === "string") {
    // TODO: Update when PostGIS support comes native in Prisma
    const nearbyRides = await getNearbyRides(latitude, longitude, radius);
    if (nearbyRides.length === 0) {
      return json({ rides: null });
    }
    const rides = await prisma.ride.findMany({
      where: {
        id: { in: nearbyRides.map((r) => r.id) },
      },
      include: { club: true, riders: true },
      take: 10,
    });
    // Hate this
    const ridesWithDistance = rides.map((ride) => {
      const nearbyRide = nearbyRides.find((r) => r.id === ride.id);
      return { ...ride, kmAway: nearbyRide?.kmAway };
    });
    return json<LoaderData>({ rides: ridesWithDistance });
  }
};

export default function RidesPage() {
  const { rides } = useLoaderData() as unknown as LoaderData;

  return (
    <div className="flex flex-col items-center">
      <RidesHeader />
      <Rides rides={rides} />
    </div>
  );
}

export function CatchBoundary() {
  const { status } = useCatch();
  return status === 404 ? (
    <Page404 />
  ) : status === 500 ? (
    <Page500 />
  ) : (
    <UnknownError />
  );
}

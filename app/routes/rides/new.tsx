import type { Club, Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Input, Select } from "~/components/common";
import { prisma } from "~/lib/db.server";
import { requireUserId } from "~/lib/session.server";
import { createRide } from "~/models/ride.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const startsAt = formData.get("startsAt");
  const duration = formData.get("duration");
  const distance = formData.get("distance");

  invariant(typeof name === "string", "Expected name to be string");
  invariant(typeof startsAt === "string", "Expected name to be string");
  invariant(typeof duration === "string", "Expected name to be string");
  invariant(typeof distance === "string", "Expected name to be string");

  const rideData: Prisma.RideUncheckedCreateInput = {
    name,
    startsAt: new Date(startsAt),
    duration: Number(duration),
    distance: Number(distance),
    creatorId: userId,
  };

  const ride = await createRide({ ...rideData });
  return redirect(`/rides/${ride.id}`);
};

type LoaderData = { clubs: Club[] };

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const clubs = await prisma.club.findMany({
    where: {
      members: { some: { id: userId } },
    },
  });
  return json<LoaderData>({ clubs });
};

export default function NewRide() {
  const { clubs } = useLoaderData<LoaderData>();
  return (
    <main className="flex justify-center">
      <div className="w-full max-w-lg flex-auto">
        <h1 className="mb-8">New Ride</h1>
        <Form className="space-y-4" method="post">
          <Input name="name" label="Ride Name" />
          <Input name="startsAt" label="Select start" type="datetime-local" />
          <Input name="duration" label="Est Duration (minutes)" />
          <Input name="distance" label="Est Distance (miles)" />
          <div>
            <Select
              disabled={clubs.length === 0}
              label="Club"
              name="club"
              id="club"
              defaultValue=""
            >
              <option value="">None</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </Select>
            {clubs.length === 0 && (
              <Link
                to="/clubs"
                className="p-1 text-sm text-gray-500 hover:text-indigo-700"
              >
                Find a club near you!
              </Link>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </Form>
      </div>
    </main>
  );
}

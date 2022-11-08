import type { Club, Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Input, Select } from "~/components/common";
import { prisma } from "~/db.server";
import { createRide } from "~/models/ride.server";
import { requireUserId } from "~/session.server";

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
    duration: +duration,
    distance: +distance,
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
    <>
      <h1>New Ride</h1>
      <Form className="flex max-w-sm flex-col gap-4" method="post">
        <Input name="name" label="Ride Name" />
        <Input name="startsAt" label="Select start" type="datetime-local" />
        <Input name="duration" label="Est Duration (minutes)" />
        <Input name="distance" label="Est Distance (miles)" />
        <Select label="Club" name="club" id="club" defaultValue="">
          <option value="">None</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </Select>
        <Button type="submit">Create</Button>
      </Form>
    </>
  );
}

import type { Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Checkbox, Input, Textarea } from "~/components/common";
import { createClub } from "~/models/club.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const isPublic = formData.get("isPublic");

  invariant(typeof name === "string", "Expected name to be string");
  invariant(
    typeof description === "string",
    "Expected description to be string"
  );
  invariant(typeof isPublic === "string", "Expected isPublic to be string");

  const clubData: Prisma.ClubUncheckedCreateInput = {
    name,
    description,
  };

  const club = await createClub(userId, { ...clubData });
  return redirect(`/clubs/${club.id}`);
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json("Success");
};

export default function NewRide() {
  return (
    <main className="flex justify-center">
      <div className="w-full max-w-lg flex-auto">
        <h1 className="mb-8">New Club</h1>
        <Form className="space-y-4" method="post">
          <Input name="name" label="Name" required />
          <Textarea name="description" label="Description" required />
          <Checkbox name="isPrivate" label="Make Private" required />
          <Button type="submit" className="w-full">
            Create
          </Button>
        </Form>
      </div>
    </main>
  );
}

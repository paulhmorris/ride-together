import type { Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { NewClubForm } from "~/components/clubs";
import { createClub } from "~/models/club.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const city = formData.get("city");
  const state = formData.get("state");
  const isPrivate = formData.get("isPrivate") === "true" ? true : false;

  invariant(typeof name === "string", "Expected name to be string");
  invariant(
    typeof description === "string",
    "Expected description to be string"
  );
  invariant(typeof city === "string", "Expected city to be string");
  invariant(typeof state === "string", "Expected state to be string");
  invariant(typeof isPrivate === "boolean", "Expected isPrivate to be string");

  const clubData: Prisma.ClubUncheckedCreateInput = {
    name,
    state,
    description,
    isPrivate,
    city,
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
        <NewClubForm />
      </div>
    </main>
  );
}

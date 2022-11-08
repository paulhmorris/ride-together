import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.userId, "Expected userId parameter");
  const user = await prisma.user.findFirst({ where: { id: params.userId } });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json<LoaderData>({ user });
};

export default function RidePage() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>User Page</h1>
      <p>Viewing user {user.id}</p>
      <p>{user.email}</p>
    </div>
  );
}

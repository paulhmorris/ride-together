import { Tab } from "@headlessui/react";
import type { Club, Ride, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  ClubDescription,
  ClubMembers,
  ClubPastRides,
  ClubRides,
  ClubTitle,
} from "~/components/clubs";
import { TabTitle } from "~/components/common";
import { getClubById } from "~/models/club.server";
import { requireUserId } from "~/session.server";

export type ClubWithMembersAndRides = {
  club: Club & {
    members: User[];
    rides: Ride[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.clubId, "Expected clubId parameter");
  const club = await getClubById(params.clubId);

  if (!club) throw new Response("Club not found", { status: 404 });

  // Private club logic
  if (club.isPrivate) {
    const userId = await requireUserId(request);
    const userIsInClub = club.members.some((m) => m.id === userId);

    if (!userIsInClub) {
      console.log(
        `Club ${club.id} is private and user is not in club ---- redirecting`
      );
      throw redirect("/clubs");
    }
  }

  return json<ClubWithMembersAndRides>({ club });
};

export default function ClubPage() {
  const { club } = useLoaderData() as unknown as ClubWithMembersAndRides;
  return (
    <main className="mx-auto max-w-screen-md">
      <ClubTitle club={club} />
      <Tab.Group>
        <Tab.List className="mb-4 flex gap-4 border-b border-gray-200 pb-2">
          <TabTitle title="Overview" />
          <TabTitle title="Members" />
          <TabTitle title="Past Rides" />
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ClubDescription description={club.description} />
            <ClubRides club={club} />
          </Tab.Panel>
          <Tab.Panel>
            <ClubMembers club={club} />
          </Tab.Panel>
          <Tab.Panel>
            <ClubPastRides />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}

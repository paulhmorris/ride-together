import type { Club, ClubJoinRequest, Ride } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatAsDateWithTime, formatDate } from "~/lib/formatters";
import { requireUserId } from "~/lib/session.server";
import { getClubsByUser, getJoinRequestsByUser } from "~/models/club.server";

type LoaderData = {
  clubs: (Club & {
    joinRequests: ClubJoinRequest[];
    rides: Ride[];
  })[];
  clubJoinRequests: (ClubJoinRequest & { club: Club })[];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const clubs = await getClubsByUser(userId);
  const clubJoinRequests = await getJoinRequestsByUser(userId);

  return json<LoaderData>({ clubs, clubJoinRequests });
};

export default function AccountClubs() {
  const { clubs, clubJoinRequests } = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="mb-8">
        <h2>Requests</h2>
        <ul className="mt-2 space-y-4">
          {clubJoinRequests.map((request) => {
            if (request.closedOn) return null;
            return (
              <li key={request.id}>
                <p>Club: {request.club.name}</p>
                <p>Sent on: {formatAsDateWithTime(request.createdAt)}</p>
                <p className="capitalize">
                  Status: {request.status.toLowerCase()}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h2>Clubs</h2>
        <ul className="mt-2 space-y-4">
          {clubs.length > 0 ? (
            clubs.map((club) => {
              const joinedOn = club.joinRequests.find(
                (req) => req.closedOn && req.status === "APPROVED"
              )?.closedOn;
              return (
                <li key={club.id}>
                  <p>{club.name}</p>
                  {joinedOn && (
                    <p>{`Member since ${formatDate(
                      joinedOn as unknown as Date,
                      "M/D/YYYY"
                    )}`}</p>
                  )}
                </li>
              );
            })
          ) : (
            <p className="text-gray-400">You're not a part of any clubs!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

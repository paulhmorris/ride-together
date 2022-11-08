import { randImg } from "@ngneat/falso";
import type { Club, ClubJoinRequest, User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Link } from "~/components/common";
import { classNames, useOptionalUser } from "~/lib/utils";
import { getAllClubs, sendJoinRequest } from "~/models/club.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const clubId = formData.get("clubId");
  if (typeof clubId !== "string" || clubId.length === 0) {
    return json(
      { errors: { clubId: "clubId is required", body: null } },
      { status: 400 }
    );
  }

  const joinRequest = await sendJoinRequest(userId, clubId);
  return json({ joinRequest }, 201);
};

type LoaderData = {
  clubs: (Club & {
    members: User[];
    joinRequests: ClubJoinRequest[];
  })[];
};

export const loader: LoaderFunction = async () => {
  const clubs = await getAllClubs();
  return json<LoaderData>({ clubs });
};

export default function ClubsIndex() {
  const { clubs } = useLoaderData<LoaderData>();
  const user = useOptionalUser();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-12">Find a club</h1>
      <ul className="w-full max-w-6xl space-y-4">
        {clubs.map((club) => {
          const hasOpenRequest =
            user && club.joinRequests.some((req) => req.userId === user.id);
          return (
            <li
              key={club.id}
              className="grid grid-cols-12 gap-8 rounded-md border border-neutral-200 bg-white py-4 px-8 text-sm text-gray-600 shadow"
            >
              <div className="col-span-1 my-auto h-12 w-12 overflow-hidden rounded-full shadow-md">
                <img src={randImg()} alt="" />
              </div>
              <div className="col-span-5">
                <p className="font-bold">{club.name}</p>
                <p>{club.description}</p>
              </div>
              <div className="col-span-2">
                <p>{`${club.members.length} members`}</p>
                <p>{`${club.city}, ${club.state}`}</p>
              </div>
              <Link
                to={`/clubs/${club.id}`}
                className="col-span-2 text-center text-gray-500"
              >
                Info
              </Link>
              <div className="col-span-2 text-right">
                {user ? (
                  <fetcher.Form method="post" className="col-span-1">
                    <input type="hidden" name="clubId" value={club.id} />
                    <Button
                      type="submit"
                      className={classNames(
                        "w-full",
                        hasOpenRequest && "text-gray-500"
                      )}
                      variant="link"
                      disabled={hasOpenRequest}
                    >
                      {hasOpenRequest ? "Requested" : "Request to join"}
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

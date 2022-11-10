import {
  HeartIcon,
  LockClosedIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import type { Club, Ride, User } from "@prisma/client";

export function ClubTitle({
  club,
}: {
  club: Club & {
    members: User[];
    rides: Ride[];
  };
}) {
  const pastRidesCount = club.rides.filter(
    (r) => r.startsAt && r.startsAt < new Date()
  ).length;
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-5xl">{club.name}</h1>
      <div className="mt-3 flex gap-2 text-sm text-gray-500">
        <p className="flex items-center gap-1">
          <UserGroupIcon className="inline-block h-4 w-4" />
          {`${club.members.length} members |`}
        </p>
        <p className="flex items-center gap-1">
          <HeartIcon className="inline-block h-4 w-4" />
          {`${pastRidesCount} rides |`}
        </p>
        <p>
          {club.isPrivate ? (
            <span className="flex items-center gap-1">
              <LockClosedIcon className="inline-block h-4 w-4" />
              Private
            </span>
          ) : (
            "Public"
          )}
        </p>
      </div>
    </div>
  );
}

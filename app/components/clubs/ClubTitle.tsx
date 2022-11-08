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
      <div className="mt-1 flex gap-2">
        <p className="text-gray-500">{`${club.members.length} members |`}</p>
        <p className="text-gray-500">{`${pastRidesCount} rides |`}</p>
      </div>
    </div>
  );
}

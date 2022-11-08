import { randImg, randSuperheroName } from "@ngneat/falso";
import { Link } from "@remix-run/react";
import type { ClubWithMembersAndRides } from "~/routes/clubs/$clubId";

export function ClubMembers({ club }: ClubWithMembersAndRides) {
  return (
    <ul className="space-y-4">
      {club.members.map((member) => {
        return (
          <li
            key={member.id}
            className="grid grid-cols-12 items-center rounded-md border border-neutral-200 bg-white py-4 px-8 text-sm text-gray-600 shadow"
          >
            <div className="col-span-2 my-auto h-12 w-12 overflow-hidden rounded-full shadow-md">
              <img src={randImg()} alt="" />
            </div>
            <h3 className="col-span-3">
              {member.nickname ? member.nickname : randSuperheroName()}
            </h3>
            <p className="col-span-4 capitalize">{member.role.toLowerCase()}</p>
            <Link
              to={`/users/${member.id}`}
              className="col-span-3 inline-block w-min text-gray-500"
            >
              Info
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

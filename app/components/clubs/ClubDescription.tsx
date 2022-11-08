import type { Club } from "@prisma/client";

export function ClubDescription({ description }: Pick<Club, "description">) {
  return <p className="mb-12 text-gray-600">{description}</p>;
}

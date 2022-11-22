import type { User } from "@prisma/client";
import type { ActionArgs } from "@remix-run/node";
import { json, Response } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Button, Input } from "~/components/common";
import { formatAsDateWithTime } from "~/lib/formatters";
import { requireUser } from "~/lib/session.server";
import { useUser } from "~/lib/utils";
import { updateUser } from "~/models/user.server";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);
  const form = await request.formData();

  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const nickname = form.get("nickname");
  const email = form.get("email");

  // Forbid changing email on this form if they get around it on the client
  if (email !== user.email) {
    throw new Response("Email change not allowed", { status: 403 });
  }

  invariant(typeof firstName === "string", "Expected firstName");
  invariant(typeof lastName === "string", "Expected lastName");
  invariant(typeof nickname === "string", "Expected nickname");
  invariant(typeof email === "string", "Expected email");

  const payload: Partial<User> = {
    id: user.id,
    firstName,
    lastName,
    nickname,
    email,
  };
  const updatedUser = await updateUser(payload);
  return json({ updatedUser });
};

export default function AccountSettings() {
  const user = useUser();

  return (
    <div>
      <h2>Settings</h2>
      <p className="mt-1 text-sm text-gray-400">{`Your account was created at ${formatAsDateWithTime(
        user.createdAt
      )}`}</p>
      <div className="mt-8">
        <form method="post" className="max-w-md space-y-4">
          <Input
            name="firstName"
            label="First Name"
            autoComplete="given-name"
            maxLength={255}
            defaultValue={user.firstName ?? ""}
          />
          <Input
            name="lastName"
            label="Last Name"
            autoComplete="family-name"
            maxLength={255}
            defaultValue={user.lastName ?? ""}
          />
          <Input
            name="nickname"
            label="Nickname"
            maxLength={255}
            defaultValue={user.nickname ?? ""}
            autoComplete="username"
          />
          <Input
            name="email"
            label="Email"
            maxLength={255}
            defaultValue={user.email}
            readOnly
          />
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
}

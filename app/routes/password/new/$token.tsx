import type { PasswordReset } from "@prisma/client";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, Response } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Input } from "~/components/common";
import { prisma } from "~/lib/db.server";
import { resetPassword } from "~/models/user.server";

export async function action({ request, params }: ActionArgs) {
  const { token: tokenParam } = params;
  if (!tokenParam) return redirect("/reset-password");

  const [token, userId] = tokenParam?.split("-");
  const formData = await request.formData();
  const password = formData.get("password");
  invariant(typeof password === "string");

  try {
    await resetPassword(token, userId, password);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Response(e.message, { status: 400 });
    }
  }

  return redirect("/login");
}

type LoaderData = {
  error?: { message?: string };
  dbToken?: PasswordReset;
};

export async function loader({ params }: LoaderArgs) {
  // Check for token param
  const { token: tokenParam } = params;
  if (!tokenParam) return redirect("/reset-password");

  const [token, userId] = tokenParam?.split("-");
  const dbToken = await prisma.passwordReset.findFirst({
    where: { token, userId },
  });
  // Redirect on no token found in url or database
  if (!dbToken) return redirect("/reset-password");

  if (dbToken.expiresAt.getTime() <= new Date().getTime()) {
    return json<LoaderData>(
      {
        error: { message: "This password reset token has expired." },
      },
      { status: 400 }
    );
  }

  return json<LoaderData>({ dbToken });
}

export const meta: MetaFunction = () => {
  return { title: "New Password" };
};

export default function LoginPage() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <main className="sm:pt-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-1">New Password</h1>
        <p className="mb-8 text-sm text-gray-500">
          Enter a new password for your account.
        </p>
        <Form method="post" className="space-y-6" noValidate>
          <Input
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            required
            autoFocus={true}
            disabled={Boolean(loaderData.error)}
          />
          <Input
            name="password-confirmation"
            type="password"
            label="Confirm Password"
            autoComplete="new-password"
            required
            disabled={Boolean(loaderData.error)}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={Boolean(loaderData.error)}
          >
            Update Password
          </Button>
          {loaderData.error && (
            <div>
              <p className="mt-4 text-center text-rose-600">
                {loaderData.error?.message}{" "}
                <Link
                  to="/reset-password"
                  className="text-slate-700 underline underline-offset-2"
                >
                  Get a new one
                </Link>
              </p>
            </div>
          )}
        </Form>
      </div>
    </main>
  );
}

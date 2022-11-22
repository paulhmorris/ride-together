import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button, Input, Link } from "~/components/common";
import { createUserSession, getUserId } from "~/lib/session.server";
import { safeRedirect, validateEmail } from "~/lib/utils";
import { createUser, getUserByEmail } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="sm:pt-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-4">Sign up</h1>
        <Form method="post" className="space-y-6" noValidate>
          <Input
            ref={emailRef}
            name="email"
            type="email"
            label="Email Address"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            required
            autoFocus={true}
            fieldError={actionData?.errors?.email}
          />
          <Input
            ref={passwordRef}
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            required
            fieldError={actionData?.errors?.password}
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <Button className="w-full" type="submit">
            Create Account
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={{ pathname: "/login", search: searchParams.toString() }}
              >
                Log In
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}

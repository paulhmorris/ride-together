import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { Button, Checkbox, Input, Link } from "~/components/common";

import { safeRedirect, validateEmail } from "~/lib/utils";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

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
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required", email: null } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password is too short", email: null } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4">Login</h1>
        <Form method="post" className="space-y-6" noValidate>
          <div className="mt-1">
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
          </div>

          <div className="mt-1">
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
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button className="w-full" type="submit">
            Login
          </Button>

          <div className="flex items-center justify-between">
            <Checkbox name="remember" label="Remember me" />
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to={{ pathname: "/join", search: searchParams.toString() }}>
                Sign Up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}

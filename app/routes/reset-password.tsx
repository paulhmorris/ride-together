import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import * as React from "react";
import { Button, Input } from "~/components/common";

import { validateEmail } from "~/lib/utils";
import { sendPasswordReset } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  await sendPasswordReset(email);

  return json({ success: true });
}

export const meta: MetaFunction = () => {
  return {
    title: "Reset Password",
  };
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const transition = useTransition();

  // React.useEffect(() => {
  //   if (actionData?.errors?.email) {
  //     emailRef.current?.focus();
  //   }
  // }, [actionData]);

  return (
    <main className="sm:pt-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-1">Reset Password</h1>
        <p className="mb-8 text-sm text-gray-500">
          Enter the email address associated with your account.
        </p>
        <Form method="post" className="space-y-6" noValidate>
          <Input
            ref={emailRef}
            name="email"
            type="email"
            label="Email Address"
            autoComplete="email"
            // aria-invalid={actionData?.errors?.email ? true : undefined}
            required
            autoFocus={true}
            // fieldError={actionData?.errors?.email}
          />

          <Button
            className="w-full"
            type="submit"
            // @ts-ignore
            disabled={transition.state === "submitting" || actionData?.success}
          >
            Submit
          </Button>
          {
            // @ts-ignore
            actionData?.success && (
              <p className="rounded-lg border-2 border-emerald-800 bg-emerald-50 p-3 text-center text-emerald-800">
                Thank you! If there's an account associated with this email
                address, you will receive an email shortly.
              </p>
            )
          }
        </Form>
      </div>
    </main>
  );
}

import { Link as RemixLink } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { classNames } from "~/lib/utils";

export const Link = ({ to, ...props }: RemixLinkProps) => {
  return (
    <RemixLink
      to={to}
      {...props}
      className={classNames(
        props.className ?? "",
        "rounded font-medium text-rose-800 underline decoration-transparent underline-offset-4 transition duration-75 hover:decoration-rose-800 focus:outline-none focus:ring-offset-2 focus-visible:decoration-transparent focus-visible:ring-2 focus-visible:ring-rose-800 disabled:pointer-events-none disabled:opacity-40"
      )}
    >
      {props.children}
    </RemixLink>
  );
};

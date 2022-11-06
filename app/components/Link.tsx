import { Link as RemixLink } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";

export const Link = ({ to, ...props }: RemixLinkProps) => {
  return (
    <RemixLink
      to={to}
      {...props}
      className="rounded font-medium text-indigo-500 underline decoration-transparent underline-offset-4 transition duration-75 hover:text-indigo-600 hover:decoration-indigo-600 focus:outline-none focus:ring-offset-2 focus-visible:decoration-transparent focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-40"
    >
      {props.children}
    </RemixLink>
  );
};

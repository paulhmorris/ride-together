import type { ComponentPropsWithoutRef } from "react";
import { classNames } from "~/lib/utils";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "link";
}

const buttonStyles = {
  base: "inline-flex items-center disabled:opacity-40 transition duration-75 focus:outline-none shadow-sm select-none",
  primary:
    "justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-3 text-base font-medium text-white shadow-sm enabled:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  secondary:
    "justify-center rounded-md border border-indigo-500 bg-transparent px-4 py-3 text-base font-medium text-indigo-500 shadow-sm enabled:hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  link: "rounded text-indigo-500 underline decoration-transparent underline-offset-4 enabled:hover:text-indigo-600 enabled:hover:decoration-indigo-600 focus:ring-offset-2 focus-visible:decoration-transparent enabled:focus-visible:ring-2 enabled:focus-visible:ring-indigo-500 shadow-none decoration-2 font-medium",
};

export const Button = ({
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={classNames(
        buttonStyles.base,
        buttonStyles[variant],
        props.className ?? ""
      )}
    >
      {children}
    </button>
  );
};

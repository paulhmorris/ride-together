import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  description?: string;
  fieldError?: string | null | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, description, fieldError, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
        <div className="mt-1">
          <input
            {...props}
            ref={ref ?? null}
            id={name}
            name={name}
            type={props.type ?? "text"}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={`${name}-error ${name}-description`}
            className={classNames(
              "block w-full rounded-md border-gray-200 shadow-sm transition duration-75 placeholder:text-gray-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
              fieldError && "focus:border-red-600 focus:ring-red-600",
              props.className
            )}
          />
          {description && !fieldError && (
            <p
              id={`${name}-description`}
              className="mt-1 text-sm text-gray-500"
            >
              {description}
            </p>
          )}
          {fieldError && (
            <p
              className="pt-1 pl-1 text-sm font-medium text-red-600"
              id={`${name}-error`}
            >
              {fieldError}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

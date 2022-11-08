import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  fieldError?: string | null | undefined;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, fieldError, ...props }, ref) => {
    return (
      <div>
        <div className="z-10 flex items-center">
          <input
            {...props}
            ref={ref ?? null}
            id={name}
            name={name}
            type="checkbox"
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={`${name}-error`}
            className={classNames(
              "h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 transition duration-75 focus:ring-indigo-500",
              props.className
            )}
          />
          <label
            htmlFor={name}
            className="ml-2 block cursor-pointer text-sm font-medium"
          >
            {label}
          </label>
        </div>
        {fieldError && (
          <div className="pt-1 text-red-700" id={`${name}-error`}>
            {fieldError}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

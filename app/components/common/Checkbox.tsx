import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  description?: string;
  fieldError?: string | null | undefined;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, description, fieldError, ...props }, ref) => {
    return (
      <div>
        <div className="z-10 flex items-start">
          <div className="flex h-5 items-center">
            <input
              {...props}
              ref={ref ?? null}
              id={name}
              name={name}
              value="true"
              type="checkbox"
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={`${name}-error ${name}-description`}
              className={classNames(
                "h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 transition duration-75 focus:ring-indigo-500",
                props.className
              )}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor={name} className="cursor-pointer font-medium">
              {label}
            </label>
            {description && (
              <p
                id={`${name}-description`}
                className="mt-1 text-sm text-gray-500"
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {fieldError && (
          <p className="pt-1 text-red-700" id={`${name}-error`}>
            {fieldError}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

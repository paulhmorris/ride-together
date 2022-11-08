import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  name: string;
  label: string;
  fieldError?: string | null | undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, label, fieldError, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
        <div className="mt-1">
          <select
            {...props}
            ref={ref ?? null}
            id={name}
            name={name}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={`${name}-error`}
            className={classNames(
              "block w-full rounded-md border-gray-300 shadow-sm transition duration-75 placeholder:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
              props.className
            )}
          />
          {fieldError && (
            <div className="pt-1 text-red-700" id={`${name}-error`}>
              {fieldError}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  name: string;
  label: string;
  includeBlank?: boolean;
  description?: string;
  fieldError?: string | null | undefined;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { name, label, includeBlank, description, fieldError, children, ...props },
    ref
  ) => {
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
            defaultValue={includeBlank ? "" : undefined}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={`${name}-error ${name}-description`}
            className={classNames(
              "block w-full rounded-md border-gray-300 shadow-sm transition duration-75 placeholder:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
              props.className
            )}
          >
            {includeBlank && (
              <option disabled={props.required} value=""></option>
            )}
            {children}
          </select>
          {description && !fieldError && (
            <p
              id={`${name}-description`}
              className="mt-1 text-sm text-gray-500"
            >
              {description}
            </p>
          )}
          {fieldError && (
            <p className="pt-1 text-red-700" id={`${name}-error`}>
              {fieldError}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

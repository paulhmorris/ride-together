import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { classNames } from "~/lib/utils";

interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  name: string;
  label: string;
  fieldError?: string | null | undefined;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, label, fieldError, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
        <div className="mt-1">
          <textarea
            {...props}
            ref={ref ?? null}
            id={name}
            name={name}
            rows={6}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={`${name}-error ${
              props["aria-describedby"] ?? ""
            }`}
            className={classNames(
              "block w-full rounded-md border-gray-300 shadow-sm placeholder:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
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

Textarea.displayName = "Textarea";

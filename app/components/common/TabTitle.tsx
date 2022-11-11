import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { classNames } from "~/lib/utils";

export function TabTitle({
  title,
  icon,
}: {
  title: string;
  icon?: JSX.Element;
}) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={classNames(
            selected
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            "inline-flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition duration-75 focus:outline-none focus-visible:outline-none"
          )}
        >
          {title}
          {icon && <span>{icon}</span>}
        </button>
      )}
    </Tab>
  );
}

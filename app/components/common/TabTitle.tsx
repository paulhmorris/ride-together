import { Tab } from "@headlessui/react";
import { classNames } from "~/lib/utils";

export function TabTitle({ title }: { title: string }) {
  return (
    <Tab className="focus-visible:outline-none">
      {({ selected }) => (
        <button
          className={classNames(
            selected
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
            "rounded-md px-6 py-2 text-sm font-medium transition duration-75"
          )}
        >
          {title}
        </button>
      )}
    </Tab>
  );
}

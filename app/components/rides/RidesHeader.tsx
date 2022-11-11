import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { useSubmit } from "@remix-run/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { getPosition } from "~/lib/utils";
import { Button, Input } from "../common";

export function RidesHeader({ children }: { children?: ReactNode }) {
  const submit = useSubmit();
  const [loadingLocation, setLoadingLocation] = useState(false);

  async function setPosition() {
    setLoadingLocation(true);
    try {
      const {
        coords: { latitude, longitude },
      } = await getPosition();
      submit(
        { longitude: longitude.toString(), latitude: latitude.toString() },
        { method: "get" }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLocation(false);
    }
  }

  return (
    <div className="mb-12">
      <h1 className="mb-8 text-center">Find a group ride</h1>
      <div className="flex h-full items-stretch gap-2">
        <Input
          label="Location"
          name="location"
          placeholder="Zip code or city"
          className="py-4"
          hideLabel
          disabled
        />
        <span className="my-auto text-gray-500">or</span>
        <div className="flex-grow">
          <Button
            className="h-full"
            title="We do not store or sell your location information"
            onClick={setPosition}
            disabled={loadingLocation}
          >
            Use my location <ShieldCheckIcon className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

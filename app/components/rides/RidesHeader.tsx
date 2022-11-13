import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { getPosition } from "~/lib/utils";
import { Button, Input, Select } from "../common";

export function RidesHeader({ children }: { children?: ReactNode }) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const longitude = searchParams.get("longitude") ?? undefined;
  const latitude = searchParams.get("latitude") ?? undefined;
  const radius = searchParams.get("radius") ?? undefined;
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState<{
    longitude: number | undefined;
    latitude: number | undefined;
  }>({ longitude: Number(longitude), latitude: Number(latitude) });

  async function setPosition() {
    setLoadingLocation(true);
    try {
      const {
        coords: { latitude, longitude },
      } = await getPosition();
      setLocation({ longitude, latitude });
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
    <div className="mb-12 w-full">
      <h1 className="mb-8 text-center">Find a group ride</h1>
      <Form
        method="get"
        action="/rides?index"
        onChange={(e) => submit(e.currentTarget)}
      >
        <div className="flex h-full items-stretch justify-center gap-2">
          <input type="hidden" name="longitude" value={location?.longitude} />
          <input type="hidden" name="latitude" value={location?.latitude} />
          <Input
            label="Location"
            name="location"
            placeholder="Zip code or city"
            className="py-4"
            hideLabel
            disabled
          />
          <span className="my-auto text-gray-500">or</span>
          <div>
            <Button
              className="h-full"
              type="button"
              title="We do not store or sell your location information"
              onClick={setPosition}
              disabled={loadingLocation}
            >
              Use my location <ShieldCheckIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="max-w-xs">
          <Select
            name="radius"
            label="Radius"
            defaultValue={radius?.toString()}
          >
            <option value="">None</option>
            <option value="5">5mi</option>
            <option value="10">10mi</option>
            <option value="25">25mi</option>
            <option value="50">50mi</option>
            <option value="100">100mi</option>
          </Select>
        </div>
      </Form>
    </div>
  );
}

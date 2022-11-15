import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { getPosition } from "~/lib/utils";
import { Button, Input, Select } from "../common";

type LonLat = Pick<GeolocationCoordinates, "longitude" | "latitude">;

export function RidesHeader() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const longitude = searchParams.get("longitude") ?? undefined;
  const latitude = searchParams.get("latitude") ?? undefined;
  const radius = searchParams.get("radius") ?? undefined;

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState<LonLat>({
    longitude: Number(longitude ?? null),
    latitude: Number(latitude ?? null),
  });

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
      setLocation({ longitude, latitude });
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
        className="mx-auto max-w-md"
        onChange={(e) => submit(e.currentTarget)}
      >
        <div className="flex h-full items-stretch justify-between gap-2">
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
          <div className="flex-1">
            <Button
              className="h-full"
              type="button"
              title="We do not store or sell your location information"
              onClick={setPosition}
              disabled={Boolean(longitude && latitude) || loadingLocation}
            >
              {loadingLocation ? (
                "Locating..."
              ) : (
                <span className="inline-flex">
                  <span>Use my location</span>
                  <ShieldCheckIcon className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
        {Boolean(location.longitude) && Boolean(location.latitude) && (
          <div className="mt-4 flex h-full items-center gap-2">
            <div className="flex-1">
              <Select
                name="radius"
                label="Radius"
                disabled={loadingLocation}
                value={radius}
              >
                <option value="">None</option>
                <option value="5">5mi</option>
                <option value="10">10mi</option>
                <option value="25">25mi</option>
                <option value="50">50mi</option>
                <option value="100">100mi</option>
              </Select>
            </div>
            {/* <div className="flex-shrink">[
              <fieldset
                disabled={loadingLocation}
                className="disabled:pointer-events-none disabled:opacity-50"
              >
                <legend className="text-sm font-medium">Change units</legend>
                <RadioGroup
                  value={unit}
                  name="unit"
                  onChange={setUnit}
                  className="mt-1 h-full"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {unitOptions.map((option) => (
                      <RadioGroup.Option
                        key={option.name}
                        value={option}
                        className={({ active, checked }) =>
                          classNames(
                            active
                              ? "ring-2 ring-indigo-500 ring-offset-2"
                              : "",
                            checked
                              ? "border-transparent bg-indigo-500 text-white"
                              : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                            "flex cursor-pointer items-center justify-center rounded-md border p-2.5 font-medium uppercase transition duration-75 focus:outline-none sm:flex-1"
                          )
                        }
                      >
                        <RadioGroup.Label as="span">
                          {option.name}
                        </RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </fieldset>
            </div>] */}
          </div>
        )}
      </Form>
    </div>
  );
}

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { joinRide, leaveRide } from "~/models/ride.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const rideId = formData.get("rideId");
  const action = formData.get("_action");

  if (typeof rideId !== "string" || rideId.length === 0) {
    return json(
      { errors: { rideId: "rideId is required", body: null } },
      { status: 400 }
    );
  }
  if (typeof action !== "string" || action.length === 0) {
    return json(
      { errors: { action: "Action is required", body: null } },
      { status: 400 }
    );
  }

  if (action === "join") {
    const ride = await joinRide(userId, rideId);
    return new Response(`Ride ${ride.id} joined`, { status: 201 });
  }

  if (action === "leave") {
    const ride = await leaveRide(userId, rideId);
    return new Response(`Ride ${ride.id} left`, { status: 201 });
  }
};

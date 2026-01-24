import { env } from "@/config/env";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import type { UserJSON } from "@clerk/backend";

const webhookSecret = env.auth.CLERK_WEBHOOK_SIGNING_SECRET;

async function validateRequest(request: Request): Promise<{ event: WebhookEvent; payload: string }> {
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
  }

  const payload = await request.text();

  const svixHeaders = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };

  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payload, svixHeaders) as WebhookEvent;
  return { event, payload };
}

export async function POST(request: Request) {
  let event: WebhookEvent;
  let payload: string;

  try {
    const result = await validateRequest(request);
    event = result.event;
    payload = result.payload;
  } catch (err: any) {
    console.error("❌ Webhook validation failed:", err.message);
    return new Response("Unauthorized", { status: 400 });
  }

  console.log(`📨 Clerk webhook received: ${event.type}`);

  // TODO: HANDLE OTHER EVENTS
  // 🔒 NARROW BY EVENT TYPE
  if (event.type !== "user.created" && event.type !== "user.updated" && event.type !== "user.deleted") {
    return new Response("Ignored", { status: 200 });
  }

  // ---------------------------
  // USER CREATED / UPDATED
  // ---------------------------
  if (event.type === "user.created" || event.type === "user.updated") {
    const user = event.data as UserJSON;

    const email = user.email_addresses?.[0]?.email_address;
    if (!email) {
      console.error("❌ Missing email in Clerk webhook");
      return new Response("Invalid user data", { status: 400 });
    }

    try {
      const response = await fetch(`${env.api.BASE_API_URL}/webhooks/clerk-webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": request.headers.get("svix-id") || "",
          "svix-timestamp": request.headers.get("svix-timestamp") || "",
          "svix-signature": request.headers.get("svix-signature") || "",
        },
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend failed:", errorText);
        return new Response("Backend failed", { status: 500 });
      }

      return new Response("OK", { status: 200 });
    } catch (err: any) {
      console.error("❌ Error forwarding webhook:", err);
      return new Response("Webhook processing failed", { status: 500 });
    }
  }

  // ---------------------------
  // USER DELETED
  // ---------------------------
  if (event.type === "user.deleted") {
    const deleted = event.data as { id: string };

    try {
      const response = await fetch(`${env.api.BASE_API_URL}/webhooks/clerk-webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": request.headers.get("svix-id") || "",
          "svix-timestamp": request.headers.get("svix-timestamp") || "",
          "svix-signature": request.headers.get("svix-signature") || "",
        },
        body: payload,
      });

      if (!response.ok) {
        return new Response("Backend failed", { status: 500 });
      }

      return new Response("OK", { status: 200 });
    } catch (err: any) {
      return new Response("Webhook processing failed", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}

import { signUpUser } from "@/api/user/create";
import { env } from "@/config/env";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const webhookSecret = env.auth.CLERK_WEBHOOK_SIGNING_SECRET;

async function validateRequest(request: Request) {
  if (!webhookSecret) throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");

  const payloadString = await request.text();
  const headers = request.headers;

  const svixHeaders = {
    "svix-id": headers.get("svix-id")!,
    "svix-timestamp": headers.get("svix-timestamp")!,
    "svix-signature": headers.get("svix-signature")!,
  };

  const wh = new Webhook(webhookSecret);

  try {
    const event = wh.verify(payloadString, svixHeaders) as WebhookEvent;
    return event;
  } catch (err) {
    console.error("❌ Invalid Clerk webhook:", err);
    throw new Response("Invalid signature", { status: 400 });
  }
}

export async function POST(request: Request) {
  let event: WebhookEvent;
  try {
    event = await validateRequest(request);
  } catch (err) {
    return new Response("Unauthorized", { status: 400 });
  }

  // Respond early
  const res = new Response("OK", { status: 200 });

  // Process asynchronously
  (async () => {
    switch (event.type) {
      case "user.created":
        signUpUser();
        console.log("✅ Clerk user created:", event.data.id);
        break;
      case "user.deleted":
        console.log("❌ Clerk user deleted:", event.data.id);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  })();

  return res;
}

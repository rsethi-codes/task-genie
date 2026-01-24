import { NextRequest, NextResponse } from "next/server";
import { OnboardingContext } from "@/lib/onboarding/types";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    const { userId, getToken } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const context: OnboardingContext = await req.json();

        // Ensure the userId in context matches the authenticated user
        context.userId = userId;

        const token = await getToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        logger.info({ route: "/api/onboarding/next", userId, stepCount: Object.keys(context.previousAnswers || {}).length }, "Onboarding next requested");

        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/onboarding/next`;
        const resp = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...context, category: "onboarding" }),
            cache: "no-store",
        });

        if (!resp.ok) {
            const txt = await resp.text();
            logger.error({ route: "/api/onboarding/next", userId, status: resp.status, body: txt }, "Backend onboarding failed");
            return NextResponse.json({ error: "Backend onboarding failed" }, { status: 500 });
        }

        const decision = await resp.json();

        logger.info({ route: "/api/onboarding/next", userId, decisionType: (decision as any)?.type }, "Onboarding decision computed");

        // In a real app, we would persist the decision/state to a database here

        return NextResponse.json(decision);
    } catch (error) {
        logger.error({ route: "/api/onboarding/next", userId, err: error }, "Onboarding API Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

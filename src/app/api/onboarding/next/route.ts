import { NextRequest, NextResponse } from "next/server";
import { getNextOnboardingDecision } from "@/lib/onboarding/orchestrator";
import { OnboardingContext } from "@/lib/onboarding/types";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const context: OnboardingContext = await req.json();

        // Ensure the userId in context matches the authenticated user
        context.userId = userId;

        const decision = await getNextOnboardingDecision(context);

        // In a real app, we would persist the decision/state to a database here

        return NextResponse.json(decision);
    } catch (error) {
        console.error("Onboarding API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

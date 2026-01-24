import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    const { userId, getToken } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { finalPersona } = await req.json();

        if (!finalPersona || !finalPersona.traits) {
            return NextResponse.json({ error: "Invalid persona data" }, { status: 400 });
        }

        const token = await getToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        logger.info({ 
            route: "/api/onboarding/save-persona", 
            userId, 
            personaVersion: finalPersona.version,
            confidence: finalPersona.confidence 
        }, "Saving onboarding persona");

        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/onboarding/save-persona`;
        const resp = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                userId,
                traits: finalPersona.traits,
                confidence: finalPersona.confidence,
                version: finalPersona.version,
                source: "onboarding_completion"
            }),
            cache: "no-store",
        });

        if (!resp.ok) {
            const txt = await resp.text();
            logger.error({ 
                route: "/api/onboarding/save-persona", 
                userId, 
                status: resp.status, 
                body: txt 
            }, "Failed to save persona to backend");
            return NextResponse.json({ error: "Failed to save persona" }, { status: 500 });
        }

        const result = await resp.json();

        logger.info({ 
            route: "/api/onboarding/save-persona", 
            userId, 
            personaId: result.id 
        }, "Persona saved successfully");

        return NextResponse.json(result);
    } catch (error) {
        logger.error({ 
            route: "/api/onboarding/save-persona", 
            userId, 
            err: error 
        }, "Save persona API Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

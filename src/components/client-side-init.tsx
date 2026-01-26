"use client";

import { useSocketInvalidation } from "@/hooks/use-socket-invalidation";

export function ClientSideInit() {
    useSocketInvalidation();
    return null;
}

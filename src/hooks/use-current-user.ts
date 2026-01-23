"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { User } from "@/types/user";

/**
 * Client-side hook to get the current user from the database
 * This combines Clerk authentication with database user data
 * 
 * @returns Object with user data, loading state, and error
 */
export function useCurrentUser() {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if (!clerkLoaded) {
                return;
            }

            if (!clerkUser) {
                setDbUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch("/api/user/me");

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const user = await response.json();
                setDbUser(user);
                setError(null);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err as Error);
                setDbUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [clerkUser, clerkLoaded]);

    return {
        user: dbUser,
        clerkUser,
        loading,
        error,
        isAuthenticated: !!clerkUser && !!dbUser,
    };
}

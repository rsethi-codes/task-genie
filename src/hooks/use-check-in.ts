
import { useAuth } from "@clerk/nextjs";
import { useState, useCallback } from "react";
import api from "@/lib/api/axios-client";

export const useCheckIn = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const request = useCallback(async (method: "post", url: string, data?: any) => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await api.request({
                method,
                url,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    const startSession = () => request("post", "/check-in/start");

    const processInput = (sessionId: string, energy: number, moods: string[], reflection?: string) =>
        request("post", "/check-in/process", { sessionId, energy, moods, reflection });

    const reply = (sessionId: string, answer: string) =>
        request("post", "/check-in/reply", { sessionId, answer });

    return {
        loading,
        startSession,
        processInput,
        reply
    };
};

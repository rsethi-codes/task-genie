import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

export function useSocketInvalidation() {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (payload: { taskId: string; status: string }) => {
            console.log("[Socket] Invalidation triggered:", payload);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task", payload.taskId] });
        };

        socket.on("task:status-updated", handleUpdate);
        socket.on("task:updated", handleUpdate);
        socket.on("task:deleted", handleUpdate);

        return () => {
            socket.off("task:status-updated", handleUpdate);
            socket.off("task:updated", handleUpdate);
            socket.off("task:deleted", handleUpdate);
        };
    }, [socket, queryClient]);
}

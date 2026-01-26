import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { TaskNode } from "@/types/task-node";

export function useTask(taskId: string | null) {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["task", taskId],
        queryFn: async () => {
            if (!taskId) return null;
            const token = await getToken();
            if (!token) throw new Error("Unauthorized");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error("Failed to fetch task");
            }

            return response.json() as Promise<TaskNode>;
        },
        enabled: !!taskId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

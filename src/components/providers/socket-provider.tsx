"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getToken, userId } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) {
            disconnectSocket();
            setSocket(null);
            setIsConnected(false);
            return;
        }

        const init = async () => {
            const token = await getToken();
            const s = connectSocket(token || undefined);

            s.on("connect", () => setIsConnected(true));
            s.on("disconnect", () => setIsConnected(false));

            setSocket(s);
        };

        init();

        return () => {
            // We don't necessarily want to disconnect on every re-render, 
            // but the lib handle ensures singleton.
        };
    }, [userId, getToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

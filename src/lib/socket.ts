import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_API_URL?.replace("/api/v1", "") || "http://localhost:5050";

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            auth: {
                token
            },
            autoConnect: false,
            reconnection: true,
        });
    }
    return socket;
};

export const connectSocket = (token?: string) => {
    const s = getSocket(token);
    if (!s.connected) {
        s.connect();
    }
    return s;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

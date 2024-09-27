"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
    subscribeToSheet: (sheetId: string) => void;
    unsubscribeFromSheet: () => void;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    subscribeToSheet: () => {},
    unsubscribeFromSheet: () => {},
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, []);

    const subscribeToSheet = (sheetId: string) => {
        if (socket && isConnected) {
            socket.emit('subscribe_sheet', sheetId);
        }
    };

    const unsubscribeFromSheet = () => {
        if (socket && isConnected) {
            socket.emit('unsubscribe_sheet');
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, subscribeToSheet, unsubscribeFromSheet }}>
            {children}
        </SocketContext.Provider>
    )
}
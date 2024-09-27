import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";

type SocketProps = {
    fetchKey: string;
}

export const useChatSocket = ({ fetchKey }: SocketProps) => {
    const { socket, isConnected } = useSocket();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        const handleFetch = (fetchedData: any) => {
            setData(fetchedData);
        };

        socket.on(fetchKey, handleFetch);

        socket.emit(fetchKey);

        return () => {
            socket.off(fetchKey, handleFetch);
        }
    }, [socket, isConnected, fetchKey]);

    return { data };
}
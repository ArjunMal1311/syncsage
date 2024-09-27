import { NextApiResponseServerIo } from "@/types/types"
import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { getSheetData } from "@/lib/get-sheet-data"

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        console.log("Setting up socket.io server");
        const path = "/api/socket/io"
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('A client connected');

            socket.on('subscribe_sheet', async (sheetId: string) => {
                console.log(`Client subscribed to sheet: ${sheetId}`);
                socket.join(sheetId);

                const fetchAndEmitData = async () => {
                    try {
                        console.log(`Fetching data for sheet: ${sheetId}`);
                        const sheetData = await getSheetData(sheetId);
                        console.log(`Emitting update for sheet: ${sheetId}`);
                        io.to(sheetId).emit('sheet_update', sheetData);
                    } catch (error) {
                        console.error('Error fetching sheet data:', error);
                    }
                };

                await fetchAndEmitData();

                const intervalId = setInterval(fetchAndEmitData, 20000); 

                socket.on('unsubscribe_sheet', () => {
                    console.log(`Client unsubscribed from sheet: ${sheetId}`);
                    clearInterval(intervalId);
                    socket.leave(sheetId);
                });

                socket.on('disconnect', () => {
                    console.log(`Client disconnected from sheet: ${sheetId}`);
                    clearInterval(intervalId);
                });
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}

export default ioHandler;
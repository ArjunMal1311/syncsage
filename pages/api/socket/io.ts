import { NextApiResponseServerIo } from "@/types/types"
import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { getLogs, getSheetData } from "@/lib/get-sheet-data"

const activeUsers = new Map<string, string[]>();
const userSheets = new Map<string, string>();

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io"
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('New connection:', socket.id);
            socket.on('subscribe_sheet', async (sheetId: string) => {
                socket.join(sheetId);

                const oldSheetId = userSheets.get(socket.id);
                if (oldSheetId) {
                    removeUserFromSheet(io, oldSheetId, socket.id);
                }

                userSheets.set(socket.id, sheetId);
                addUserToSheet(io, sheetId, socket.id);

                if (!activeUsers.has(sheetId)) {
                    activeUsers.set(sheetId, []);
                }

                activeUsers.get(sheetId)!.push(socket.id);
                const activeCount = activeUsers.get(sheetId)!.length;                
                io.to(sheetId).emit('active_users', activeCount);

                const fetchAndEmitData = async () => {
                    try {
                        const sheetData = await getSheetData(sheetId);
                        const logs = await getLogs(sheetId);
                        io.to(sheetId).emit('sheet_update', { sheetData, logs });
                    } catch (error) {
                        console.error('Error fetching sheet data:', error);
                    }
                };

                await fetchAndEmitData();
                const intervalId = setInterval(fetchAndEmitData, 10000); 

                socket.on('unsubscribe_sheet', () => {
                    socket.leave(sheetId);
                    
                    const users = activeUsers.get(sheetId);
                    if (users) {
                        const index = users.indexOf(socket.id);
                        if (index > -1) {
                            users.splice(index, 1);
                        }
                        if (users.length === 0) {
                            activeUsers.delete(sheetId);
                        }
                    }
                    
                    const activeCount = activeUsers.get(sheetId)?.length || 0;
                    console.log(`Active users for sheet ${sheetId} after unsubscribe: ${activeCount}`);
                    io.to(sheetId).emit('active_users', activeCount);
                });

                socket.on('disconnect', () => {
                    const sheetId = userSheets.get(socket.id);
                    if (sheetId) {
                        removeUserFromSheet(io, sheetId, socket.id);
                        userSheets.delete(socket.id);
                    }
                    Array.from(activeUsers).forEach(([sheetId, users]) => {
                        const index = users.indexOf(socket.id);
                        if (index > -1) {
                            users.splice(index, 1);
                            if (users.length === 0) {
                                activeUsers.delete(sheetId);
                            }
                            const activeCount = users.length;
                            io.to(sheetId).emit('active_users', activeCount);
                        }
                    });
                });
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}

export default ioHandler;

function addUserToSheet(io: ServerIO, sheetId: string, socketId: string) {
    if (!activeUsers.has(sheetId)) {
        activeUsers.set(sheetId, []);
    }
    activeUsers.get(sheetId)!.push(socketId);
    updateActiveUsersCount(io, sheetId);
}

function removeUserFromSheet(io: ServerIO, sheetId: string, socketId: string) {
    const users = activeUsers.get(sheetId);
    if (users) {
        const index = users.indexOf(socketId);
        if (index > -1) {
            users.splice(index, 1);
            updateActiveUsersCount(io, sheetId);
        }
    }
}

function updateActiveUsersCount(io: ServerIO, sheetId: string) {
    const count = activeUsers.get(sheetId)?.length || 0;
    io.to(sheetId).emit('active_users', count);
}
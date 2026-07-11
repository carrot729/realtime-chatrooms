import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { compose } from "stream";

let io: Server;

export const initSocket = (httpServer: HttpServer, corsOrigin: string) => {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);

      console.log(`User joined ${roomId}`);
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);

      console.log(`User left ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet — call initSocket first");
  }
  return io;
};

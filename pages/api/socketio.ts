import { Server } from "socket.io";
const util = require("util");

const getRooms = (io: Server, msg: string) => {
  const nsp: any = io.of("/");
  const rooms = nsp.adapter.rooms;

  const list: any = {};
  rooms.forEach((value: any, key: any, map: any) => {
    const room: any = rooms.get(key);

    // if (room === undefined) continue;
    const sockets: any = [];
    let roomName = "";
    for (let socketId of room.entries()) {
      const socket = nsp?.sockets.get(socketId[1]);
      if (
        socket !== undefined &&
        socket.username !== undefined &&
        socket.room !== undefined
      ) {
        sockets.push(socket.username);
        if (roomName === "") roomName = socket.room;
      }
    }
    if (roomName !== "") {
      list[roomName] = sockets;
    }
  });
  return list;
};

const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      // const roomsList = getRooms(io, "connected");
      // io.emit("rooms", roomsList);
      socket.on("chat message", ({ room, msg }) => {
        io.in(room).emit("chat message", `${(socket as any).username}: ${msg}`);
      });

      socket.on("set username", (name) => {
        (socket as any).username = name;
        const roomsList = getRooms(io, "connected");
        io.emit("rooms", roomsList);
      });

      socket.on("new room", (room) => {
        (socket as any).room = room;
        socket.join(room);
        socket.emit("chat message", room);
        // getRooms(io, "new room");
        const roomsL = getRooms(io, "connected");
        io.emit("rooms", roomsL);
      });

      socket.on("join room", (room: any) => {
        (socket as any).room = room;
        socket.join(room);
        socket.emit("joined room", room);
      });
    });
    res.socket.server.io = io;
  } else {
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

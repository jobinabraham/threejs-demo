import { Server } from "socket.io";
const util = require("util");

const getRooms = (io: Server, msg: string) => {
  const nsp = io.of("/");
  const rooms = nsp.adapter.rooms;
  console.log("rooms", util.inspect(rooms));
  const list = {};
  for (let roomId in rooms) {
    const room = rooms.get(roomId);
    console.log("room", util.inspect(room));
    if (room === undefined) continue;
  }
};

const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("chat message", (msg) => {
        console.log("Chat message recieved on server", msg);
        socket.emit("chat message", msg);
      });

      socket.on("set username", (name) => {
        (socket as any).username = name;
      });

      socket.on("new room", (room) => {
        console.log(` A new room is created ${room}`);
        (socket as any).room = room;
        socket.join(room);
        socket.emit("chat message", room);
        getRooms(io, "new room");
      });
    });
    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

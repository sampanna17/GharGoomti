import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

const addUser = (userID, socketId) => {
  const userExits = onlineUser.find((user) => user.userID === userID);
  if (!userExits) {
    onlineUser.push({ userID, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userID) => {
  return onlineUser.find((user) => user.userID === userID);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userID) => {
    addUser(userID, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    try {
      const receiver = getUser(receiverId);
      if (!receiver) throw new Error("Receiver offline");
      io.to(receiver.socketId).emit("getMessage", data);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("8888");
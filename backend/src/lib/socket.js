import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// 定义在线用户数组
const userSocketMap = new Map();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getUserSocketId(userId){
  return userSocketMap.get(userId)
}


io.on("connection", (socket) =>{
  console.log(" 有用户连接了 ", socket.id);

  const userId = socket.handshake.query.userId;
  if(userId){
    userSocketMap.set(userId, socket.id)
  }

  // io.emit 广播消息
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()))

  socket.on("disconnect", () => {
    console.log(" 有用户断开了连接 ", socket.id);

    userSocketMap.delete(userId)
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()))
  });
});

export { io, app, server };
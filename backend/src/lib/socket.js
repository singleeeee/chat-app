import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_MODE}` })

const app = express();
const server = http.createServer(app);

// 定义在线用户数组
const userSocketMap = new Map();
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

export function getUserSocketId(userId){
  return userSocketMap.get(userId)
}


io.on("connection", (socket) =>{
  console.log(`用户${socket.id}连接了 `);

  const userId = socket.handshake.query.userId;
  if(userId){
    userSocketMap.set(userId, socket.id)
  }

  // io.emit 广播消息
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()))

  socket.on("disconnect", () => {
    console.log(`用户${socket.id}断开了连接`);

    userSocketMap.delete(userId)
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()))
  });
});

export { io, app, server };
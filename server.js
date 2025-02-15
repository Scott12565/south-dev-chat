const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500", // Use the client URL
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    let user = '';

    // Global user joins
    socket.on('newUser', (newUser) => {
        user = newUser;
        io.emit('newUser', newUser); // Still global for initial connection
    });

    // Join a specific room
    socket.on('joinRoom', ({ user, room }) => {
        socket.join(room);
        socket.currentRoom = room;
        io.to(room).emit('chatMessage', { user: 'System', msg: `${user} joined ${room}` });
    });

    // Leave room
    socket.on('leaveRoom', ({ user, room }) => {
        socket.leave(room);
        io.to(room).emit('chatMessage', { user: 'System', msg: `${user} left ${room}` });
    });

    // Send messages only to the intended room
    socket.on('chatMessage', ({ user, msg, room }) => {
        if (room) {
            io.to(room).emit('chatMessage', { user, msg, room }); // Send only to users in the room
        } else {
            io.emit('chatMessage', { user, msg }); // Global message if no room
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`${user} has left the chat`);
    });
});

server.listen(3001, () => console.log("Server running on port 3001"));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001; // 🔥 Use Render's assigned port

const io = new Server(server, {
    cors: {
      origin: "*", // Allow frontend to connect
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    let user = '';

    socket.on('newUser', (newUser) => {
        user = newUser;
        io.emit('newUser', newUser);
    });

    socket.on('joinRoom', ({ user, room }) => {
        socket.join(room);
        socket.currentRoom = room;
        io.to(room).emit('chatMessage', { user: 'System', msg: `${user} joined ${room}` });
    });

    socket.on('leaveRoom', ({ user, room }) => {
        socket.leave(room);
        io.to(room).emit('chatMessage', { user: 'System', msg: `${user} left ${room}` });
    });

    socket.on('chatMessage', ({ user, msg, room }) => {
        if (room) {
            io.to(room).emit('chatMessage', { user, msg, room });
        } else {
            io.emit('chatMessage', { user, msg });
        }
    });

    socket.on('disconnect', () => {
        console.log(`${user} has left the chat`);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

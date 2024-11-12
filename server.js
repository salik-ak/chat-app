const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const users = {};

io.on("connection", (socket) => {
    console.log("New user connected");

    // User joins a room
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };
        socket.broadcast.to(room).emit("message", {
            username: "System",
            message: `${username} has joined the room`,
            time: moment().format("HH:mm")
        });
    });

    // User sends a message
    socket.on("chatMessage", (message) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit("message", {
                username: user.username,
                message,
                time: moment().format("HH:mm")
            });
        }
    });

    // User disconnects
    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit("message", {
                username: "System",
                message: `${user.username} has left the room`,
                time: moment().format("HH:mm")
            });
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

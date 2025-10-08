const { Socket } = require("dgram");
const express = require("express");
const http = require("http");
const { Server } = require('socket.io');


const app = express();

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins (for development)
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Main running');
});

io.on(`connection`, (socket) => {
    console.log('A user is conected', socket.id);

    socket.on(`message`, (data) => {
        console.log(`Received message:`, data);

        io.emit('message', `${socket.id.substr(0, 2)} said ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconneted:', socket.id);
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
});
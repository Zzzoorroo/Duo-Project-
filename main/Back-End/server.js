//database 
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chatdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));



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

    socket.on("registerUser", ({ username, email }) => {
        socket.data.username = username;
        socket.data.email = email;
        console.log(`${username} by the email  (${email}) connected`);
        socket.broadcast.emit("userJoined", { username });
    });

    socket.on(`message`, (data) => {
        const username = socket.data.username || "Anonymous";
        const message = `${username}: ${data}`;

        console.log(`Received message:`, `${data} sent by ${username}`);

        io.emit('message', `${username} said ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconneted:', socket.id);
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
});
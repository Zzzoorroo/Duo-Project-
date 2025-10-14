const express = require("express");
const http = require("http");
const { Server } = require('socket.io');
const db = require("./db");

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins (for development)
        methods: ["GET", "POST"]
    }
});

const MAX_MESSAGES = 50;

app.get('/', (req, res) => {
    res.send('Main running');
});

io.on(`connection`, (socket) => {
    console.log('A user is conected', socket.id);

    //getting the user infos 
    socket.on("registerUser", ({ username, email }) => {
        socket.data.username = username;
        socket.data.email = email;
        console.log(`${username} by the email  (${email}) connected`);
        socket.broadcast.emit("userJoined", { username });
    });

    const stmt = db.prepare("SELECT * FROM messages ORDER BY id DESC LIMIT ?");
    const messages = stmt.all(MAX_MESSAGES).reverse();
    socket.emit("chatHistory", messages);

    //listening to message 
    socket.on(`message`, (data) => {
        const username = socket.data.username || "Anonymous";
        const message = `${username}: ${data}`;
        const time = new Date().toISOString();

        console.log(`Received message:`, `${data} sent by ${username}`);

        //save msg to database 
        const insert = db.prepare("INSERT INTO messages (username, text, time) VALUES (?,?,?)");
        insert.run(username, data, time);

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
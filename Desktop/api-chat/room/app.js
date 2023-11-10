const http = require('http');
const socketio = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

const io = new socketio.Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
        socket.join(data.name, () => {
            console.log('odaya girdiniz');
            io.to(data.name).emit('new join');
        });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

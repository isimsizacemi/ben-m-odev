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

const nsp = io.of('/93creative');
nsp.on('connection', (socket)=>{
    console.log('biri geldi la')

    socket.on('isimYaz', (data)=> {
        nsp.emit('herkese yolla', {name: data.name});
    })
});



server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000/93creative`);
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // İzin verilen kök URL'sini buraya ekleyin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    }
});

io.on('connection', (socket) => {
    console.log('kullanıcı bağlandı');
    
    socket.on('disconnect' , () => {
        console.log('Kullanıcı Çıkış Yaptı');
    });

    socket.on('new-user', (data)=> {
        socket.broadcast.emit('user',  {name : data.name}); // burada Broadcast diğer kullanıcılara gösteriyor ama sana göstermez askdsakd
    })
    socket.on('selamVer', () =>{
        console.log('Selam');
    })


  
   

    socket.emit('userData' , { // emit burada veri gönderir karşıda da socket.io('emitten yolladığın isim', socket de ne yapmak istiyorusun onuda bruaya yazarsın errov func olarak. İki tarafrada kullanabilirsin bnunu)
        city: "Çorum",
        name: "isimsizacemi"
    })
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

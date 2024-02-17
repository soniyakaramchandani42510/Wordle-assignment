const express = require('express');
const app = express();
const http = require('http')
const {Server}=require('socket.io')



const cors = require('cors');

app.use(cors())
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'https://wordle-assignment.netlify.app/',
        methods:["GET","POST"]
    }
})

app.use(cors());

let totalClients = 0;
// io.on('connection',function(socket){
//     console.log('hiii')
//     socket.on('disconnect',function(){
//         console.log('dis')
//     })
// })
io.on('connection', (socket) => {
    totalClients++;
    io.emit('clients-total', totalClients);

    socket.on('message', (data) => {
        console.log('data....',data)
        io.emit('chat-message', data);
    });
    socket.on('disconnect', () => {
        totalClients--;
        io.emit('clients-total', totalClients);
    });
    console.log("hello")
});

const PORT =  8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

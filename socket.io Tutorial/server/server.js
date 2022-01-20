const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
server.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});

const users = []
let current_turn = Math.round(Math.random());
io.on('connection', (socket) => {
console.log("connection");
    if (socket.client.conn.server.clientsCount >= 3) {
        console.log("max user reached");
        socket.disconnect();
        return;
    } else{
    console.log('A user just connected.');
    users.push(socket.id);

    socket.on('startGame', () => {

        if(users[current_turn] == socket.id){
            socket.emit('setTurn', true);
        }else{
            socket.emit('setTurn', false);
        }
        current_turn = 1-current_turn;


        io.emit('startGame',);
    })
    socket.on('crazyIsClicked', (data) => {
        io.emit('crazyIsClicked', data);
    });
    socket.on('disconnect', () => {
        
        console.log('A user has disconnected.');
    })
}
});



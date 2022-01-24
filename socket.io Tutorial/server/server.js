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

    console.log('A user just connected.');

    socket.on('joinRoom', function (gid) {
        if(gid==-1){
            gid = io.sockets.adapter.rooms.size
        }
        var room = 'game'+gid;
        socket.join(room);
        io.emit('roomRefresh',{roomid:room});
    });




    // users.push(socket.id);
    // if (users.length == 2) {
    //     io.emit("gameReady", { state: true });
    // } else {
    //     io.emit("gameReady", { state: false });
    // }

    socket.on('startGame', () => {
        io.emit('startGame',);
        SetTurn();

    })
    

    socket.on('crazyIsClicked', (data) => {
        SetTurn();
        io.emit('crazyIsClicked', data);


    });
    socket.on('disconnect', () => {
        io.emit("gameReady", { state: false });
        var discconnectIndex = users.indexOf(socket.id);
        users.splice(discconnectIndex, 1);
        console.log('A user has disconnected.');
    })
    function SetTurn() {
        io.emit('setTurn', users[current_turn]);

        current_turn = 1 - current_turn;

    }



});



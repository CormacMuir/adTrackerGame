const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');;
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const mongo = require('mongodb').MongoClient;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
server.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});
mongo.connect('mongodb://127.0.0.1/', function(err, client) {
    if (err) throw err
    var db = client.db('adGameTest');

    console.log('Database connected')

    const rooms = []
    const users = {}


    io.on('connection', (socket) => {
        let db_users = db.collection('users');

        console.log('A user just connected.');

        socket.emit('populateRooms', rooms);

        socket.on('joinRoom', (gid) => {
            console.log("room created");
            if (gid == -1) {
                gid = io.sockets.adapter.rooms.size
                var room = 'game' + gid;
                socket.join(room);
                rooms.push(room);


                io.emit('roomRefresh', { roomid: room, action: "add" });
                socket.emit('joinGameLobby', room)


            } else {
                socket.join(gid);
                io.emit('roomRefresh', { roomid: gid, action: "remove" });
                const index = rooms.indexOf(gid);
                rooms.splice(index, 1);
                socket.emit('joinGameLobby', gid)
            }

        });
        socket.on('gameReadyCheck', () => {
            currentRoom = getCurrentRoom();
            currentRoomPlayers = io.sockets.adapter.rooms.get(currentRoom);
            console.log(currentRoomPlayers);
            if (currentRoomPlayers.size == 2) {
                io.in(getCurrentRoom()).emit('gameReady', { state: true });
                var gameData = { userList: Array.from(currentRoomPlayers), current_turn: Math.round(Math.random()) };
                users[currentRoom] = gameData;

            }

        });
        socket.on('startGame', () => {
            io.in(getCurrentRoom()).emit('startGame', );
            SetTurn(getCurrentRoom());
        });


socket.on('crazyIsClicked', (data) => {
            currentRoom = getCurrentRoom();
            SetTurn();
            io.in(currentRoom).emit('crazyIsClicked', data);
        });        


        function SetTurn() {
            currentRoom = getCurrentRoom();
            userData = users[currentRoom];

            io.in(currentRoom).emit('setTurn', userData.userList[userData.current_turn]);

            userData.current_turn = 1 - userData.current_turn;
            users[currentRoom] = userData;
        }

        function getCurrentRoom() {
            return Array.from(socket.rooms).pop();
        }
        socket.on('disconnect', () => {

            // var discconnectIndex = users.indexOf(socket.id);
            // users.splice(discconnectIndex, 1);
            // var index = users_inGame.indexOf(socket.id);
            // if (index != -1) {
            //     users_inGame.splice(index, 1);
            // }
            console.log('A user has disconnected.');
        })

        client.close();

        // socket.on("checkIfInGame", () => {
        //     let status = users_inGame.includes(socket.id);
        //     console.log(users_inGame);
        //     console.log("current User: " + socket.id);
        //     console.log(status);
        //     socket.emit("currentStatus", status);
        // })




        // users.push(socket.id);
        // if (users.length == 2) {
        //     io.emit("gameReady", { state: true });
        // } else {
        //     io.emit("gameReady", { state: false });
        // }


    });
});
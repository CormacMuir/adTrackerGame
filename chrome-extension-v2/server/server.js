const { Server } = require("socket.io"), { createServer } = require("http"),
    httpServer = createServer(),
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    });


let rooms = []
let users = {}

io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.on("getRooms", () => {
        console.info("getting rooms...");
        socket.emit('populateRooms', rooms);
    });

    socket.on('joinRoom', (gid) => {
        console.log("room created: " + gid);
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
            io.in(getCurrentRoom()).emit('alert');
        }

    });

    socket.on("clearRooms", () => {
        rooms = [];
    });

    socket.on('gameReadyCheck', () => {
        currentRoom = getCurrentRoom();
        currentRoomPlayers = io.sockets.adapter.rooms.get(currentRoom);
        console.log(currentRoomPlayers);
        if (currentRoomPlayers.size == 2) {
            io.in(getCurrentRoom()).emit('gameReady', { state: true });
            var gameData = { userList: Array.from(currentRoomPlayers), current_turn: Math.round(Math.random()), readys: 0 };
            users[currentRoom] = gameData;

        }

    });

    socket.on('readyUp', () => {
        currentRoom = getCurrentRoom();
        gameData = users[currentRoom];
        if (gameData.readys == 0) {
            gameData.readys = 1;
            users[currentRoom] = gameData;
        } else {
            SetTurn(getCurrentRoom());
        }
    });

    function SetTurn() {
        currentRoom = getCurrentRoom();
        gameData = users[currentRoom];

        io.in(currentRoom).emit('setTurn', gameData.userList[gameData.current_turn]);
    }





    function getCurrentRoom() {
        return Array.from(socket.rooms).pop();
    }


    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});
httpServer.listen(process.env.PORT || 3000);
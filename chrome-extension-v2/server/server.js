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
        socket.emit('populateRooms', rooms);
    });

    socket.on('joinRoom', (gid) => {
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

    socket.on("clearRooms", () => {
        rooms = [];
    });

    socket.on('gameReadyCheck', () => {
        currentRoom = getCurrentRoom();
        currentRoomPlayers = io.sockets.adapter.rooms.get(currentRoom);
        if (currentRoomPlayers.size == 2) {
            io.in(getCurrentRoom()).emit('gameReady', { state: true });
            var gameData = { userList: Array.from(currentRoomPlayers), scores: [0, 0], current_turn: Math.round(Math.random()), readys: 0 };
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
            let targetScore = Math.floor(Math.random() * 20) + 10;
            io.in(currentRoom).emit('initGame', targetScore);
            SetTurn(getCurrentRoom());

        }
    });

    socket.on('turnComplete', (score) => {
        currentRoom = getCurrentRoom();
        gameData = users[currentRoom];
        const index = gameData.userList.indexOf(socket.id);
        
        gameData.scores[index] = score;
        console.info(gameData);
        if (gameData.readys == 1) {
            gameData.readys = 2;
            users[currentRoom] = gameData;
            SetTurn();
        } else {
            users[currentRoom] = gameData;
            gameFinished(gameData);
        }



    });

    function SetTurn() {
        currentRoom = getCurrentRoom();
        gameData = users[currentRoom];
        io.in(currentRoom).emit('setTurn', gameData.userList[gameData.current_turn]);
        gameData.current_turn = 1 - gameData.current_turn;
        users[currentRoom] = gameData;
    }

    function gameFinished(gameData) {
        user1 = { id: gameData.userList[0], score: gameData.scores[0] }
        user2 = { id: gameData.userList[1], score: gameData.scores[1] }

        if (user1.score == user2.score) {
            io.to(user1.id).emit('gameFinished', { result: "tie", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "tie", opponnentScore: user1.score });
        } else if (user1.score > user2.score) {
            io.to(user1.id).emit('gameFinished', { result: "win", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "lose", opponnentScore: user1.score });
        } else if (user2.score > user1.score) {
            io.to(user1.id).emit('gameFinished', { result: "lose", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "win", opponnentScore: user1.score });

        }

    }

    function getCurrentRoom() {
        return Array.from(socket.rooms).pop();
    }


    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});
httpServer.listen(process.env.PORT || 3000);
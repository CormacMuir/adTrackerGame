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
const { database } = require('./config/helpers');

let rooms = {}
let users = {}

io.on("connection", (socket) => {

    database.table('user').withFields(['id', 'name']).getAll().then(data => {
        console.info(Object.keys(data).length);
        console.info(data);
    })
        .catch(err => console.log(err))


    // database.table('user')
    //     .filter({ name: { $sql: '="simon"' } })
    //     .remove()
    //     .then(res => {
    //         console.log(res)
    //     })

    //database.query('INSERT INTO user (id, name) VALUES ("g", "simon");')

  

    console.info(`Client connected [id=${socket.id}]`);
    socket.on("getRooms", () => {
        socket.emit('populateRooms', rooms);
    });


    socket.on('joinRoom', (gid, username = null) => {
        if (gid == -1) {
            gid = io.sockets.adapter.rooms.size
            var room = 'game' + gid;
            socket.join(room);
            rooms[room] = username;
            io.emit('roomRefresh', { roomid: room, action: "add", creator: username });
            socket.emit('joinGameLobby', { roomid: room, creator: username });


        } else {
            socket.join(gid);
            io.emit('roomRefresh', { roomid: gid, action: "remove" });
            var username = rooms[gid];
            delete rooms[gid];
            socket.emit('joinGameLobby', { roomid: gid, creator: username });
        }

    });

    socket.on("clearRooms", () => {
        rooms = {}
    });

    socket.on('gameReadyCheck', () => {
        currentRoom = getCurrentRoom();
        currentRoomPlayers = io.sockets.adapter.rooms.get(currentRoom);
        if (currentRoomPlayers.size == 2) {
            io.in(getCurrentRoom()).emit('gameReady', { state: true });
            var gameData = { userList: Array.from(currentRoomPlayers), scores: [0, 0], current_turn: Math.round(Math.random()), readys: 0, goal: 0 };
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
            gameData = users[currentRoom];
            gameData.goal = targetScore;
            users[currentRoom] = gameData;
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
        targetScore = users[currentRoom].goal;

        user1 = { id: gameData.userList[0], score: gameData.scores[0] }
        user2 = { id: gameData.userList[1], score: gameData.scores[1] }

        if (user1.score > targetScore && user2.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "tie", opponnentScore: "BUST" });
            io.to(user2.id).emit('gameFinished', { result: "tie", opponnentScore: "BUST" });
        } else if (user1.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "lose", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "win", opponnentScore: "BUST" });
        } else if (user2.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "win", opponnentScore: "BUST" });
            io.to(user2.id).emit('gameFinished', { result: "lose", opponnentScore: user1.score });
        }
        else if (user1.score == user2.score) {
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
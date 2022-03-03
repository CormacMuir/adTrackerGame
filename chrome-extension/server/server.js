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
const { Logger } = require("mongodb");
const { database } = require('./config/helpers');

rooms = {}
games = {}
socketIDtoDbID = {}

io.on("connection", (socket) => {

    socket.on("dbCheck", (uid) => {
        database.table('user').filter({ id: uid }).getAll().then(data => {
            if (data.length == 0) {
                database.query('INSERT INTO user (id) VALUES ("' + uid + '");')
                createLog("User connected for first time");
            }
        });
        socketIDtoDbID[socket.id] = uid;

    });

    console.info(`Client connected [id=${socket.id}]`);
    socket.on("getRooms", () => {
        socket.emit('populateRooms', rooms);
    });

    socket.on('joinRoom', (gid, username = null) => {
        checkDatabaseUsername(username, socketIDtoDbID[socket.id]);
        if (gid == -1) {
            gid = io.sockets.adapter.rooms.size
            var room = 'game' + gid;
            socket.join(room);
            rooms[room] = username;
            io.emit('roomRefresh', { roomid: room, action: "add", creator: username });
            socket.emit('joinGameLobby', { roomid: room, creator: username });
            createLog("User created a game", room);

        } else {
            socket.join(gid);
            io.emit('roomRefresh', { roomid: gid, action: "remove" });
            var username = rooms[gid];
            delete rooms[gid];
            socket.emit('joinGameLobby', { roomid: gid, creator: username });
            createLog("User joined a room", gid);
        }

    });

    socket.on("getPlayerStats", () => {
        uid = socketIDtoDbID[socket.id]
        stats = getPlayerStats(uid);
        createLog("Player accessed stats page");
    });

    socket.on("clearRooms", () => {
        rooms = {}
    });

    socket.on('gameReadyCheck', () => {
        currentRoom = getCurrentRoom();
        currentRoomPlayers = io.sockets.adapter.rooms.get(currentRoom);
        if (currentRoomPlayers.size == 2) {
            io.in(getCurrentRoom()).emit('gameReady', { state: true });
            var gameData = {
                userList: Array.from(currentRoomPlayers),
                scores: [0, 0],
                current_turn: Math.round(Math.random()),
                readys: 0,
                goal: 0,
                starttime: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            games[currentRoom] = gameData;

        }

    });

    socket.on('readyUp', () => {
        currentRoom = getCurrentRoom();
        gameData = games[currentRoom];
        if (gameData.readys == 0) {
            gameData.readys = 1;
            games[currentRoom] = gameData;
        } else {
            let targetScore = Math.floor(Math.random() * 20) + 10;
            gameData = games[currentRoom];
            gameData.goal = targetScore;
            games[currentRoom] = gameData;
            io.in(currentRoom).emit('initGame', targetScore);
            SetTurn(getCurrentRoom());

        }
    });

    socket.on('turnComplete', (score) => {
        currentRoom = getCurrentRoom();
        gameData = games[currentRoom];
        const index = gameData.userList.indexOf(socket.id);
        gameData.scores[index] = score;
        writeScoreToDatabase(score);
        if (gameData.readys == 1) {
            gameData.readys = 2;
            games[currentRoom] = gameData;
            SetTurn();
        } else {
            games[currentRoom] = gameData;
            winner = gameFinished(gameData);
            writeGameToDatabase({
                winner: winner,
                starttime: gameData.starttime,
                user1: socketIDtoDbID[gameData.userList[0]],
                user2: socketIDtoDbID[gameData.userList[1]]
            })
        }
    });

    function SetTurn() {
        currentRoom = getCurrentRoom();
        gameData = games[currentRoom];
        io.in(currentRoom).emit('setTurn', gameData.userList[gameData.current_turn]);
        gameData.current_turn = 1 - gameData.current_turn;
        games[currentRoom] = gameData;
    }

    function gameFinished(gameData) {
        targetScore = games[currentRoom].goal;

        user1 = { id: gameData.userList[0], score: gameData.scores[0] }
        user2 = { id: gameData.userList[1], score: gameData.scores[1] }

        if (user1.score > targetScore && user2.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "tie", opponnentScore: "BUST" });
            io.to(user2.id).emit('gameFinished', { result: "tie", opponnentScore: "BUST" });
            return "tie";
        } else if (user1.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "lose", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "win", opponnentScore: "BUST" });
            return socketIDtoDbID[user2.id];
        } else if (user2.score > targetScore) {
            io.to(user1.id).emit('gameFinished', { result: "win", opponnentScore: "BUST" });
            io.to(user2.id).emit('gameFinished', { result: "lose", opponnentScore: user1.score });
            return socketIDtoDbID[user1.id];
        } else if (user1.score == user2.score) {
            io.to(user1.id).emit('gameFinished', { result: "tie", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "tie", opponnentScore: user1.score });
            return "tie";
        } else if (user1.score > user2.score) {
            io.to(user1.id).emit('gameFinished', { result: "win", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "lose", opponnentScore: user1.score });
            return socketIDtoDbID[user1.id];
        } else if (user2.score > user1.score) {
            io.to(user1.id).emit('gameFinished', { result: "lose", opponnentScore: user2.score });
            io.to(user2.id).emit('gameFinished', { result: "win", opponnentScore: user1.score });
            return socketIDtoDbID[user2.id];

        }
    }


    socket.on("log", (logMessage) => {
        createLog(logMessage, getCurrentRoom())
    });

    function getCurrentRoom() {
        if (Array.from(socket.rooms).length == 1) {
            return null
        } else {

            return Array.from(socket.rooms).pop();
        }
    }
        function checkDatabaseUsername(username, uid) {
            database.table('user').filter({ id: String(uid) }).getAll().then(data => {
                if (data[0].name == null) {
                    database.query(`UPDATE user SET name= "${username}" WHERE id = "${uid}";`)
                }
            });
        }
        function writeScoreToDatabase(score) {
            uid = socketIDtoDbID[socket.id]
            database.query(`UPDATE user SET adcount= adcount + ${score} WHERE id = "${uid}";`)
        }
        function writeGameToDatabase(data) {
            finishtime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            database.query(`INSERT into game_history (user1,user2,winner,start,finish)VALUES ("${data.user1}","${data.user2}","${data.winner}","${data.starttime}","${finishtime}");`)

        }

        function getPlayerStats(uid) {
            playerStats = {}
            database.table('game_history').filter({ $or: [{ user1: uid }, { user2: uid }] }).sort({ finish: 1 }).getAll().then(data => {
                playerStats.games_played = data.length;
                playerStats.wins = 0;
                playerStats.draws = 0;
                for (var i = 0; i < data.length; i++) {

                    if (data[i].winner == uid) {
                        playerStats.wins++;
                    } else if (data[i].winner == "tie") {
                        playerStats.draws++;
                    }
                }
                playerStats.losses = playerStats.games_played - (playerStats.wins + playerStats.draws);

                database.table('user').filter({ id: String(uid) }).getAll().then(data => {
                    trackers = data[0].adcount
                    playerStats.trackers = trackers;
                    socket.emit("stats", playerStats);

                });



            });
        }

        function createLog(e, gameid = null) {
            timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
            eventuser = socketIDtoDbID[socket.id];
            database.query(`INSERT INTO logs (event,timestamp,eventuser,gameid) VALUES ("${e}","${timestamp}","${eventuser}","${gameid}");`)
        }
        socket.on("disconnect", () => {
            delete socketIDtoDbID[socket.id]
        });
    });
httpServer.listen(process.env.PORT || 3000);
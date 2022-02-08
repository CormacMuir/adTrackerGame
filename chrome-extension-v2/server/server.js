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
let users_inGame = []

io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.on("getRooms", () => {
        socket.emit('populateRooms', rooms);
    });

    socket.on('joinRoom', (gid) => {
        console.log("room created: " + gid);
        if (gid == -1) {
            gid = io.sockets.adapter.rooms.size
            var room = 'game' + gid;
            socket.join(room);
            rooms.push(room);
            users_inGame.push(socket);


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
        users_inGame = [];
    });
    socket.on('sendMessage', (message) => {
        console.log("display");
        currentRoom = getCurrentRoom(socket);
        io.in(currentRoom).emit('messageSend',message);
        console.log("display");
    });

    socket.on('crazyIsClicked', (data) => {
        currentRoom = getCurrentRoom();
        SetTurn();
        io.in(currentRoom).emit('crazyIsClicked', data);
    });

    function getCurrentRoom() {
        return Array.from(socket.rooms).pop();
    }


    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });

    socket.on("testConnection", () => {
        if(users_inGame.indexOf(socket) >= 0){
        io.in(getCurrentRoom()).emit('testConnection',getCurrentRoom());
        }
    })
});


httpServer.listen(process.env.PORT || 3000);
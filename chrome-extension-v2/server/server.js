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

io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

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
            io.in(getCurrentRoom()).emit('alert');
        }

    });

    socket.on("getRooms", () => {
        socket.emit('populateRooms', rooms);
    })
    socket.on("clearRooms", () => {
        rooms = [];
    })
    socket.on("displayMessage", (message) => {
        console.log(getCurrentRoom());
        console.log(message);
        socket.emit("displayMessage", message);
    })

    function getCurrentRoom() {
        return Array.from(socket.rooms).pop();
    }

    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});

httpServer.listen(3000);
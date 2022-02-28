//connection to server
//const socket = io.connect("https://adtracker-l4project.herokuapp.com/");
//local connection for dev purposes
const socket = io.connect("http://localhost:3000");
chrome.storage.local.get("uid", function(f) {
    socket.emit("dbCheck", f.uid)
});



chrome.runtime.onMessage.addListener((message) => {
    if (message.createLobby === true) {
        chrome.storage.local.get("username", function(f) {
            socket.emit('joinRoom', -1, f.username)
        });
    } else if (typeof message.joinRoom !== 'undefined') {
        socket.emit('joinRoom', message.joinRoom);
        chrome.runtime.sendMessage({ updateLobbyLabel: message.joinRoom });

    } else if (message.getRooms === true) {
        socket.emit('getRooms');
    } else if (message.clearRooms === true) {
        socket.emit("clearRooms");
    } else if (typeof message.readyClick !== 'undefined') {
        socket.emit("readyUp");
    } else if (message.turnComplete === true) {
        chrome.storage.local.get("adCount", function(f) {
            socket.emit("turnComplete", f.adCount);
        })

    }
})

socket.on('populateRooms', (roomList) => {

    Object.keys(roomList).forEach(function(key) {
        data = {};
        data.roomid = key;
        data.creator = roomList[key];
        chrome.runtime.sendMessage({ addRoom: data });
    });

})
socket.on('roomRefresh', (data) => {

    if (data.action == "add") {
        chrome.runtime.sendMessage({ addRoom: data });
    } else if (data.action = "remove") {
        chrome.runtime.sendMessage({ removeRoom: data.roomid });

    }
});
socket.on('joinGameLobby', (data) => {
    console.info("data?")
    console.info(data)
    chrome.storage.local.set({ 'lobby': data.creator });
    chrome.runtime.sendMessage({ joinLobby: data.roomid });
    socket.emit("gameReadyCheck");
})

socket.on('gameReady', (data) => {
    if (data.state == true) {
        chrome.runtime.sendMessage({ 'readyUp': true });
        chrome.storage.local.set({ 'ready': "available" });

    }
});

socket.on('setTurn', (data) => {
    if (socket.id == data) {
        chrome.storage.local.set({ 'myTurn': true });
    } else {
        chrome.storage.local.set({ 'myTurn': false });
    }
});
socket.on('initGame', (targetScore) => {
    chrome.storage.local.remove("ready");
    setupGame(targetScore);
});

socket.on("gameFinished", (game) => {
    console.info(game);
    chrome.storage.local.set({ 'result': game.result });
    chrome.storage.local.set({ 'opponnentScore': game.opponnentScore });

    chrome.storage.local.set({ 'gameStatus': "finished" });

});



function setupGame(targetScore) {
    chrome.storage.local.remove('waiting');
    chrome.storage.local.set({ 'adCount': 0 });
    chrome.storage.local.set({ 'turn': 0 });
    chrome.storage.local.set({ 'goal': targetScore });
    chrome.storage.local.set({ 'gameStatus': "inProgress" });
    chrome.storage.local.set({ 'domainHistory': [] });
}
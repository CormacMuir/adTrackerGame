//connection to server
//const socket = io.connect("https://adtracker-l4project.herokuapp.com/");
//local connection for dev purposes
const socket = io.connect("http://localhost:3000");

chrome.runtime.onMessage.addListener((message) => {
    if (message.createLobby === true) {
        socket.emit('joinRoom', -1)
    } else if (typeof message.joinRoom !== 'undefined') {
        socket.emit('joinRoom', message.joinRoom);
        chrome.runtime.sendMessage({ updateLobbyLabel: message.joinRoom });

    } else if (message.getRooms === true) {
        socket.emit('getRooms');
    } else if (message.clearRooms === true) {
        socket.emit("clearRooms");
    } else if (typeof message.readyClick !== 'undefined') {
        socket.emit("readyUp");
    } else if(message.turnComplete===true){
        chrome.storage.local.get("adCount", function (f) {
            socket.emit("turnComplete",f.adCount);
        })
        
    }
})

socket.on('populateRooms', (roomList) => {
    for (var room of roomList) {
        chrome.runtime.sendMessage({ addRoom: room });
    }
})
socket.on('roomRefresh', (data) => {

    if (data.action == "add") {
        chrome.runtime.sendMessage({ addRoom: data.roomid });
    } else if (data.action = "remove") {
        chrome.runtime.sendMessage({ removeRoom: data.roomid });

    }
});
socket.on('joinGameLobby', (roomid) => {
    chrome.storage.local.set({ 'lobby': roomid });
    chrome.runtime.sendMessage({ joinLobby: roomid });
    socket.emit("gameReadyCheck");
})

socket.on('gameReady', (data) => {
    if (data.state == true) {
        chrome.runtime.sendMessage({ 'readyUp': true });
        chrome.storage.local.set({ 'ready': true });

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
    setupGame(targetScore);
});

socket.on("gameFinished",(game)=>{
    console.info(game);
    chrome.storage.local.set({ 'result': game.result });
    chrome.storage.local.set({ 'opponnentScore': game.opponnentScore });
    
    chrome.storage.local.set({ 'gameStatus': "finished" });

});



function setupGame(targetScore) {
    chrome.storage.local.clear();
    chrome.storage.local.set({ 'adCount': 0 });
    chrome.storage.local.set({ 'turn': 0 });
    chrome.storage.local.set({ 'goal': targetScore });
    chrome.storage.local.set({ 'gameStatus': "inProgress" });
    chrome.storage.local.set({ 'domainHistory': [] });
}


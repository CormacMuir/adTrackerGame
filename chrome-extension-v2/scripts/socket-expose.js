//connection to server
//const socket = io.connect("https://adtracker-l4project.herokuapp.com/");
const socket = io.connect("http://localhost:3000");

chrome.runtime.onMessage.addListener((message) => {
    if (message.createLobby === true) {
        socket.emit('joinRoom', -1)
    } else if (typeof message.joinRoom !== 'undefined') {
        socket.emit('joinRoom', message.joinRoom);
        chrome.runtime.sendMessage({ updateLobbyLabel: message.joinRoom });

    } else if (message.getRooms === true) {
        socket.emit('getRooms');
    } else if (typeof message.addChat !== 'undefined') {
        console.log("message sending...");
        socket.emit('displayMessage', message.addChat);
        console.log("message sent");
    } else if (message.clearRooms === true) {
        socket.emit("clearRooms");
    }
});

socket.on('displayMessage'), (message) => {
    console.log("sss");
    chrome.runtime.sendMessage({ displayMessage: message });
}
socket.on('populateRooms', (roomList) => {
    for (var room of roomList) {
        chrome.runtime.sendMessage({ addRoom: room });
    }
});
socket.on('joinGameLobby', (roomid) => {
    chrome.storage.local.set({ 'lobby': roomid });
    chrome.runtime.sendMessage({ joinLobby: roomid });
});

socket.on('alert', () => {
    alert("room full");
})
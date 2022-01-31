var socket = io.connect('http://localhost:3000');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.createLobby === true) {
        alert('lobbyCreate')
        socket.emit('joinRoom', -1)
    }
});

socket.on('populateRooms', (roomList) => {
    for (var room of roomList) {
        addRoom(room);
    }

});
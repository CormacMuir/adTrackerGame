let socket = io();
const startingSection = document.querySelector('.starting-section');
const homeBtn = document.querySelector('.home-btn');
let crazyButton = document.getElementById('crazyButton');
let startButton = document.getElementById("startButton");


startButton.addEventListener('click', () => {
    socket.emit('startGame');
})
crazyButton.addEventListener('click', () => {
    socket.emit('crazyIsClicked', {
        offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 100),
        offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 50)
    });

})

socket.on('startGame', () => {
    hideStartButton();
});

socket.on('setTurn', (data) => {
    if (socket.id == data) {
        updateScreen(true);
        
    }
    else {
        updateScreen(false);
    }
});


socket.on('crazyIsClicked', (data) => {
    goCrazy(data.offsetLeft, data.offsetTop);

});

function hideStartButton() {
    startButton.style.display = "none";
    crazyButton.style.display = "block";
    startingSection.style.display = "none";
}
function goCrazy(offLeft, offTop) {
    let top, left;
    left = offLeft;
    top = offTop;
    crazyButton.style.top = top + 'px';
    crazyButton.style.left = left + 'px';
    crazyButton.style.animation = "none";
}

function updateScreen(turn) {
    if (turn == false) {
        crazyButton.disabled = true;
    } else {
        crazyButton.disabled = false;
    }
}
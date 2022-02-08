//chrome stuff
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;
        } else if (key == "waiting") {
            window.location.reload();
        }

    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (typeof message.joinLobby !== 'undefined') {
        alert(message.joinLobby);
        $('#lobbySelect').hide()
        $('#lobby').show()
        document.getElementById("lobbyLabel").innerHTML = message.joinLobby;

    } else if (typeof message.addRoom !== 'undefined') {
        roomid = message.addRoom;
        var lobbySelect = document.getElementById("lobbySelect");
        let btn = document.createElement("button");
        btn.innerHTML = roomid;
        btn.id = roomid;
        btn.onclick = function () {
            chrome.runtime.sendMessage({ joinRoom: btn.id });
        };
        lobbySelect.appendChild(btn);
    } else if (typeof message.updateLobbyLabel !== 'undefined') {
        document.getElementById("lobbyLabel").innerHTML = message.updateLobbyLabel;
    }else if (typeof message.displayMessage !== 'undefined'){
        alert("message");
        addChat(message.displayMessage);
    }
});



document.getElementById("create").addEventListener("click", function () {
    chrome.runtime.sendMessage({ createLobby: true });
});
document.getElementById("newGame").addEventListener("click", function () {
    setupGame();
});

document.getElementById("stick").addEventListener("click", function () {
    checkGameOutcome();
});

document.getElementById("twist").addEventListener("click", function () {
    chrome.storage.local.set({ "waiting": "true" })
    chrome.storage.local.get("turn", function (f) {
        chrome.storage.local.set({ "turn": f.turn + 1 });
    })
    chrome.storage.local.remove("currentURL");

    window.location.reload();
});

function checkGameOutcome() {
    chrome.storage.local.get("adCount", function (f) {
        chrome.storage.local.get("botScore", function (g) {
            chrome.storage.local.get("goal", function (h) {
                let adCount = f.adCount;
                let botScore = g.botScore;
                let goal = h.goal;

                if (adCount > goal || botScore > adCount) {
                    chrome.storage.local.set({ 'gameResult': "lose" });
                } else if (adCount == botScore) {

                    chrome.storage.local.set({ 'gameResult': "tie" });
                } else {

                    chrome.storage.local.set({ 'gameResult': "win" });
                }
            })
        })
    })

    window.location.reload();

}

function setupGame() {
    console.log("Setting up new game...");
    let randomGoal = Math.floor(Math.random() * 25 + 5);
    let botScore = Math.floor(Math.random() * randomGoal + 1);

    chrome.storage.local.clear();
    chrome.storage.local.set({ 'adCount': 0 });
    chrome.storage.local.set({ 'turn': 0 });
    chrome.storage.local.set({ 'goal': randomGoal });
    chrome.storage.local.set({ 'botScore': botScore });
    chrome.storage.local.set({ 'gameResult': "inProgress" });
    chrome.storage.local.set({ 'domainHistory': [] });

    window.location.reload();

}

window.onload = function () {
    refreshPopup();
}

//function which fixed a bug where when the user closes the popup.html
//the html would be overwritten and would no longer show the updated html
function refreshPopup() {
    $('.resultScreen').hide();
    $('#error').hide();


    chrome.runtime.sendMessage({ getRooms: true });

    chrome.storage.local.get("lobby", function (f) {
        if (f.lobby) {
            $('#lobbySelect').hide()
            $('#lobby').show()
            document.getElementById("lobbyLabel").innerHTML = f.lobby;
        }

    })
    chrome.storage.local.get("gameResult", function (f) {
        if (f.gameResult != "inProgress") {
            showResultScreen(f.gameResult);
        } else {
            chrome.storage.local.get("waiting", function (f) {
                if (f.waiting) {
                    $('.gameButtons').hide(0);

                } else {
                    $('.awaitingResponse').hide(0);
                }
            })
            chrome.storage.local.get("adCount", function (f) {
                document.getElementById("adCount").innerHTML = f.adCount;
            })
            chrome.storage.local.get("goal", function (f) {
                document.getElementById("goal").innerHTML = f.goal;
            })
            chrome.storage.local.get("turn", function (f) {
                if (f.turn == 0) {
                    document.getElementById("stick").disabled = true;
                }
            })
            chrome.storage.local.get("error", function (f) {
                if (f.error == "true") {
                    console.log("showing error");
                    $('#error').show();
                }
            })

            chrome.storage.local.get("currentURL", function (f) {

                if (f.currentURL) {
                    document.getElementById("currentURL").innerHTML = f.currentURL;
                }
            })


        }
    })

    //need functions to manipulate DOM to make code more readable i.e. "function resultScreen()"
    function showResultScreen(gameResult) {
        $('.resultScreen').show(0);
        $('.gameScreen').hide(0);
        document.getElementById("result").innerHTML = gameResult;
        chrome.storage.local.get("adCount", function (f) {
            document.getElementById("finalScore").innerHTML = f.adCount;
        })
    }


    //ADMIN BUTTON- REMOVE FOR PROD
    document.getElementById("admin").addEventListener("click", function () {
        chrome.runtime.sendMessage({ 'clearRooms': true });
        chrome.storage.local.remove("lobby");
        setupGame();
    });
}

document.getElementById("messagebtn").addEventListener("click", function () {
    let chat = prompt("Whats your message! :)");
    if (chat != null) {
        chrome.runtime.sendMessage({ addChat: chat });
        
    }
});

function addChat(message) {
    var chat = document.getElementById("chat");
    let chatentry = document.createElement("h2");
    chatentry.innerHTML = message;
    chat.appendChild(chatentry);
}
//chrome stuff
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;
        } else if (key == "waiting") {
            window.location.reload();
        } else if (key == "myTurn") {
            window.location.reload();
        }

    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (typeof message.joinLobby !== 'undefined') {

        window.location.reload();

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
    } else if (typeof message.removeRoom !== 'undefined') {
        roomid = message.removeRoom;
        let btn = document.getElementById(roomid);
        btn.remove();
    } else if (typeof message.updateLobbyLabel !== 'undefined') {
        document.getElementById("lobbyLabel").innerHTML = message.updateLobbyLabel;
    } else if (message.readyUp === true) {
        document.getElementById("readyBtn").disabled = false;
    }
});



document.getElementById("create").addEventListener("click", function () {
    chrome.runtime.sendMessage({ createLobby: true });
});

document.getElementById("readyBtn").addEventListener("click", function () {
    chrome.runtime.sendMessage({ 'readyClick': true });
    document.getElementById("readyBtn").disabled = true;
    chrome.storage.local.remove("ready");
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
                    chrome.storage.local.set({ 'gameStatus': "lose" });
                } else if (adCount == botScore) {

                    chrome.storage.local.set({ 'gameStatus': "tie" });
                } else {

                    chrome.storage.local.set({ 'gameStatus': "win" });
                }
            })
        })
    })

    window.location.reload();

}



window.onload = function () {
    refreshPopup();
}

//function which fixed a bug where when the user closes the popup.html
//the html would be overwritten and would no longer show the updated html
function refreshPopup() {
    chrome.runtime.sendMessage({ getRooms: true });
    chrome.storage.local.get("lobby", function (f) {
        if (f.lobby) {
            $('#lobbySelect').hide()
            $('#lobby').show()
            document.getElementById("lobbyLabel").innerHTML = f.lobby;
            chrome.storage.local.get("ready", function (g) {
                if (g.ready === true) {
                    document.getElementById("readyBtn").disabled = false;
                }
            })
        }
    })
    chrome.storage.local.get("gameStatus", function (f) {
        if (f.gameStatus != "inProgress") {
            showResultScreen(f.gameStatus);
        } else {
            $('#lobbySelect').hide()
            $('#lobby').hide()
            chrome.storage.local.get("myTurn", function (g) {

                if (g.myTurn === true) {
                    $('#game').show()
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
                } else if (g.myTurn === false) {
                    $('#waitingForOpponent').show()
                }
            })
        }
    })

    //need functions to manipulate DOM to make code more readable i.e. "function resultScreen()"
    function showResultScreen(gameStatus) {
        $('.resultScreen').show(0);
        $('.gameScreen').hide(0);
        document.getElementById("result").innerHTML = gameStatus;
        chrome.storage.local.get("adCount", function (f) {
            document.getElementById("finalScore").innerHTML = f.adCount;
        })
    }


    //ADMIN BUTTON- REMOVE FOR PROD
    document.getElementById("admin").addEventListener("click", function () {
        chrome.storage.local.clear();
        chrome.runtime.sendMessage({ 'clearRooms': true });
        chrome.storage.local.remove("lobby");
        window.location.reload()

    });
}




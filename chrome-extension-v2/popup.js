chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;
        } else if (key == "waiting") {
            window.location.reload();
        } else if (key == "myTurn") {
            window.location.reload();
        } else if (key == "gameStatus") {
            window.location.reload();
        }

    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (typeof message.joinLobby !== 'undefined') {

        window.location.reload();

    } else if (typeof message.addRoom !== 'undefined') {
        console.log(message.addRoom)
        roomid = message.addRoom.roomid;
        creator = message.addRoom.creator
        var activeGames = document.getElementById("activeGames");
        let btn = document.createElement("button");
        btn.setAttribute("class", "list-group-item list-group-item-action active");
        btn.innerHTML = creator + "'s game";
        btn.id = roomid;
        btn.onclick = function () {
            chrome.runtime.sendMessage({ joinRoom: btn.id });
        };
        activeGames.appendChild(btn);





    } else if (typeof message.removeRoom !== 'undefined') {
        roomid = message.removeRoom;
        let btn = document.getElementById(roomid);
        btn.remove();
    } else if (typeof message.updateLobbyLabel !== 'undefined') {
        document.getElementById("lobbyLabel").innerHTML = message.updateLobbyLabel;
    } else if (message.readyUp === true) {
        $('#readyBtn').prop('disabled', false);
    }
});

document.getElementById("createbtn").addEventListener("click", function () {
    chrome.runtime.sendMessage({ createLobby: true });
});

document.getElementById("readyBtn").addEventListener("click", function () {
    chrome.runtime.sendMessage({ 'readyClick': true });
    $('#readyBtn').hide();
    $('#ready-div').show();
    chrome.storage.local.set({"ready":"waiting"});
});


document.getElementById("stick").addEventListener("click", function () {
    chrome.runtime.sendMessage({ 'turnComplete': true })
});

document.getElementById("twist").addEventListener("click", function () {
    chrome.storage.local.set({ "waiting": "true" })
    chrome.storage.local.get("turn", function (f) {
        chrome.storage.local.set({ "turn": f.turn + 1 });
    })
    chrome.storage.local.remove("currentURL");

    window.location.reload();
});

document.getElementById("home").addEventListener("click", function () {
    chrome.storage.local.remove("lobby");
    chrome.storage.local.remove("gameStatus");
});


window.onload = function () {
    refreshPopup();
}
//function which fixed a bug where when the user closes the popup.html
//the html would be overwritten and would no longer show the updated html
function refreshPopup() {
    chrome.storage.local.get("username", function (f) {
        if (!f.username || f.username == "null") {
            x = prompt("Please enter a username!", "Anonymous");
            chrome.storage.local.set({ "username": String(x) });
        }
    });

    chrome.storage.local.get("gameStatus", function (f) {
        if (f.gameStatus == "inProgress") {
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
                            $('#stick').prop('disabled', true);
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
        } else if (f.gameStatus == "finished") {

            chrome.storage.local.get("result", function (g) {
                var r = $('#result');
                r.html(g.result);
                if(g.result=="win"){
                    r.css('color', 'green');
                }else if(g.result=="lose"){
                    r.css('color', 'red');
                }
            })
            chrome.storage.local.get("opponnentScore", function (g) {
                $('#opponnentScore span').html(g.opponnentScore);
            })
            chrome.storage.local.get("adCount", function (g) {
                $('#adCount span').html(g.adCount);
            })
            chrome.storage.local.get("goal", function (g) {
                $('#goal span').html(g.goal);
            })
            $('#resultScreen').show()

        } else {
            $('#lobbySelect').show()
            chrome.runtime.sendMessage({ getRooms: true });
            chrome.storage.local.get("lobby", function (f) {
                if (f.lobby) {
                    $('#lobbySelect').hide()
                    $('#lobby').show()
                    document.getElementById("lobbyLabel").innerHTML = f.lobby + "'s Game";
                    chrome.storage.local.get("ready", function (g) {
                        if (g.ready == "waiting") {
                            $('#readyBtn').hide();
                            $('#ready-div').show();
                        }else if(g.ready=="available"){
                            $('#readyBtn').prop('disabled', false);
                        }
                    })
                }
            })
        }
    })
    //ADMIN BUTTON- REMOVE FOR PROD
    document.getElementById("admin").addEventListener("click", function () {
        chrome.runtime.sendMessage({ 'clearRooms': true });
        window.location.reload()
        clearStorage();
    });
}


function clearStorage() {
    chrome.storage.local.remove("currentURL");
    chrome.storage.local.remove("lobby");
    chrome.storage.local.remove("domainHistory");
    chrome.storage.local.remove("turn");
    chrome.storage.local.remove("result");
    chrome.storage.local.remove("gameStatus");

};
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;
        }
    }
});

document.getElementById("newGame").addEventListener("click", function () {
    chrome.storage.local.remove("error");
    console.log("SETTING UP GAME!");
    setupGame();
});

document.getElementById("stick").addEventListener("click", function () {
    checkGameOutcome();
});

document.getElementById("twist").addEventListener("click", function () {
    chrome.storage.local.get("turn", function (f) {
        chrome.storage.local.set({ "turn": f.turn + 1 })
    })
    window.location.reload();
});


function hideElements() {
    var elems = document.body.getElementsByTagName("*");
    for (var i = 0; i < elems.length; i++) {
        elems[i].hidden = true;
    }
}
function checkGameOutcome() {
    hideElements();
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
    console.log("SETTING UP GAME!");
    let randomGoal = Math.floor(Math.random() * 25 + 5);
    let botScore = Math.floor(Math.random() * randomGoal + 1);

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

    chrome.storage.local.get("gameResult", function (f) {
        if (f.gameResult != "inProgress") {

            showResultScreen(f.gameResult);

        } else {
            chrome.storage.local.get("adCount", function (f) {
                document.getElementById("adCount").innerHTML = f.adCount;
                document.getElementById("adCount").hidden = false;
            })

            chrome.storage.local.get("goal", function (f) {
                document.getElementById("goal").innerHTML = f.goal;
                document.getElementById("goal").hidden = false;
            })

            document.getElementById("newGame").hidden = true;

            chrome.storage.local.get("turn", function (f) {
                if (f.turn == 0) {
                    document.getElementById("stick").hidden = false;
                    document.getElementById("stick").disabled = true;
                    document.getElementById("twist").hidden = false;
                } else {
                    document.getElementById("stick").hidden = false;
                    document.getElementById("twist").hidden = false;
                }
            })
            chrome.storage.local.get("error", function (f) {

                if (f.error) {
                    document.getElementById("error").hidden = false;
                } else {
                    document.getElementById("error").hidden = true;
                }
            })
        }
    })

    //need functions to manipulate DOM to make code more readable i.e. "function resultScreen()"
    function showResultScreen(gameResult) {
        
        $('.resultScreen').show();
        document.getElementById("result").innerHTML = gameResult;
        

        chrome.storage.local.get("adCount", function (f) {
            document.getElementById("finalScore").innerHTML = f.adCount;
            document.getElementById("finalScore").hidden = false;
        })


    }

}
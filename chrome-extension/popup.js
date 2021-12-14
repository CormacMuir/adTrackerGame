chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;

        } 

    }
});

document.getElementById("newGame").addEventListener("click", function () {
    setupGame();
});

document.getElementById("stick").addEventListener("click", function () {
    chrome.storage.local.set({ 'inGame': "false" });
    checkGameOutcome();
});

function hideElements() {
    var elems = document.body.getElementsByTagName("*");
    for(var i = 0; i < elems.length; i++){
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
                    document.getElementById("goal").innerHTML = "lose";
                    chrome.storage.local.set({ 'gameResult': "lose" });
                } else if (adCount == botScore) {
                    document.getElementById("goal").innerHTML = "tie";
                    chrome.storage.local.set({ 'gameResult': "tie" });
                } else {
                    document.getElementById("goal").innerHTML = "win";
                    chrome.storage.local.set({ 'gameResult': "win" });
                }

                document.getElementById("result").hidden = false;
                document.getElementById("newGame").hidden = false;
                
                

                })
            })
        })
        


}
function setupGame() {
    let randomGoal = Math.floor(Math.random() * 25 + 5);
    let botScore = Math.floor(Math.random() * randomGoal + 1);
    chrome.storage.local.set({ 'inGame': "true" });
    chrome.storage.local.set({ 'adCount': 0 });
    chrome.storage.local.set({ 'goal': randomGoal });
    chrome.storage.local.set({ 'botScore': botScore });
    document.getElementById("newGame").hidden = true;
    document.getElementById("stick").hidden = false;
    document.getElementById("goal").innerHTML = randomGoal;

}



window.onload = function () {
    refreshPopup();
}

//function which fixed a bug where when the user closes the popup.html
//the html would be overwritten and would no longer show the updated html
function refreshPopup() {
    chrome.storage.local.get("adCount", function (f) {
        document.getElementById("adCount").innerHTML = f.adCount;
    })

    chrome.storage.local.get("goal", function (f) {
        document.getElementById("goal").innerHTML = f.goal;
    })

    chrome.storage.local.get("gameResult", function (f) {
        document.getElementById("result").innerHTML = f.gameResult;
    })

    chrome.storage.local.get("inGame", function (f) {
        if (f.inGame == "true") {
            document.getElementById("stick").hidden = false;
            document.getElementById("newGame").hidden = true;
        }
    })


}
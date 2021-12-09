var currentAdCount = null;
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "adCount") {
            document.getElementById("adCount").innerHTML = changes['adCount'].newValue;
            currentAdCount = changes['adCount'].newValue;
        }
    }

});

//function which fixed a bug where when the user closes the popup.html
//the html would be overwritten and would no longer show the current ad count
window.onload = function () {
    chrome.storage.local.get("adCount", function(f){
        document.getElementById("adCount").innerHTML = f.adCount;
    })
}
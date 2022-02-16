//Once the page has loaded, listen for ad trackers for 8 more seconds and then the players turn is over.

chrome.storage.local.get("waiting", function(f) {
    if (f.waiting == 'valid') {
        setTimeout(() => {
            chrome.storage.local.set({ "waiting": "complete" });
        }, 8000);

    }
})
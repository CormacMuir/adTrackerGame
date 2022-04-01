chrome.storage.local.get("uid", function(f) {
    if (!f.uid) {
        let i = parseInt(new Date().getTime() / 1000);
        chrome.storage.local.set({ 'uid': i });
    }
});
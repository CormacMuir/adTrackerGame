//this needs to change, these should be information that will be sent to server.
//Dont want a new adCount ONLY when the user installs the app
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ 'adCount': 0 });
});
const filter = { urls: ["<all_urls>"] };
var unique_hosts = [];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.local.get("turn", function(g) {
        if (changeInfo.status == 'loading') {
            let url = new URL(tab.url)

            let domain = url.hostname
            chrome.storage.local.get("domainHistory", function(f) {
                if (f.domainHistory.length < g.turn && domain != "newtab" && domain != "extensions") {
                    if (f.domainHistory.includes(domain)) {
                        chrome.storage.local.set({ 'error': "true" });
                    } else {
                        f.domainHistory.push(domain);
                        chrome.storage.local.set({ "domainHistory": f.domainHistory });
                        chrome.storage.local.set({ 'currentURL': domain });
                        chrome.storage.local.set({ 'waiting': "valid" });
                        chrome.storage.local.remove("error");
                        unique_hosts = [];
                    }
                } else {
                    console.log("not a new turn");
                }
            });
        }
    })
})


chrome.webRequest.onBeforeRequest.addListener(function(details) {
    chrome.storage.local.get("waiting", function(f) {
        if (f.waiting != "complete") {

            var match = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var domain = match[0] && match[1];
            var hostname = domain.substring(0, domain.lastIndexOf('.'));
            if (domain != null) {
                if (unique_hosts.indexOf(hostname) === -1) {
                    unique_hosts.push(hostname);
                    if ((hostname in tracker_domains || domain in tracker_domains) && f.waiting == "valid") {

                        chrome.storage.local.get("adCount", function(f) {
                            chrome.storage.local.set({ "adCount": f.adCount + 1 })
                        })
                        console.log("ad found: " + hostname);


                    }
                }
            }
        } else {
            chrome.storage.local.remove("waiting");
        }
    })
}, filter);
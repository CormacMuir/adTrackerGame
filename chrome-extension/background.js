const filter = { urls: ["<all_urls>"] };
var unique_hosts = [];

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.local.get("turn", function (g) {
        if (changeInfo.status == 'loading') {
            let url = new URL(tab.url)

            let domain = url.hostname
            chrome.storage.local.get("domainHistory", function (f) {
                if (f.domainHistory) {
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
                    }
                }
            });
        }
    })
})


chrome.webRequest.onBeforeRequest.addListener(function (details) {
    chrome.storage.local.get("waiting", function (f) {
        if (f.waiting != "complete") {
            var match = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            if (match) {
                var domain = match[0] && match[1];
            }try {
                var hostname = domain.substring(0, domain.lastIndexOf('.'));
            }catch (error) {
                console.error(error);
            }
            /*if a domain has been found, firstly check that its a unique host, i.e. we haven't already 
            communicated with the advertiser during this website visit. */
            if (domain != null) {
                if (unique_hosts.indexOf(hostname) === -1) {
                    unique_hosts.push(hostname);
                    /* check if the domain is in the list of known tracker domains and so long as the users turn is valid
                    increment the users adCount */
                    if ((hostname in tracker_domains || domain in tracker_domains) && f.waiting == "valid") {
                        chrome.storage.local.get("adCount", function (f) {
                            chrome.storage.local.set({ "adCount": f.adCount + 1 })
                        })
                        console.log("ad found: " + hostname);
                    }
                }
            }
        } else {
            chrome.storage.local.remove("waiting");
        }
    }) }, filter);
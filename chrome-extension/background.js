
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ 'totalAds': 0 });
});

var filter = { urls: ["<all_urls>"] };
var unique_domains = []
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    alert(Object.keys(tracker_domains).length);
    
    var match = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = match && match[1];


    if(domain){
        if(unique_domains.indexOf(domain) === -1) {
            alert(unique_domains.length)
            unique_domains.push(domain);
            alert(domain);}

        
    }

}, filter);





chrome.tabs.onUpdated.addListener(function (tabId, info) {

    if (info.status === 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

            let url = tabs[0].url;
            alert(url)


        });

    }
});
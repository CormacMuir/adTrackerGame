
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ 'totalAds': 0 });
});

var filter = { urls: ["<all_urls>"] };

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    
    var match = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = match && match[1];
    
    var unique_domains = []
    


    if(domain){
        if(unique_domains.indexOf(domain) === -1) {
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
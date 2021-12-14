//this needs to change, these should be information that will be sent to server.
//Dont want a new adCount ONLY when the user installs the app
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ 'adCount': 0});
    chrome.storage.local.set({'inGame':"false"});
});

var filter = { urls: ["<all_urls>"] };
var unique_hosts = []
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    
    
    var match = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = match[0]&&match[1];
    var hostname = domain.substring(0,domain.lastIndexOf('.'));
    if(domain!=null){
        if(unique_hosts.indexOf(hostname) === -1) {
            unique_hosts.push(hostname);
            console.log(hostname);
            if(hostname in tracker_domains || domain in tracker_domains){

                chrome.storage.local.get("adCount", function(f){
                    chrome.storage.local.set({"adCount":f.adCount+1})
                    })
            console.log("AD TRACKER FOUND! "+ hostname);}}
    }

}, filter);


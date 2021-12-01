import { tracker_domains } from './trackerlist.mjs'
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ 'totalAds': 0 });
});



chrome.tabs.onUpdated.addListener(function(tabId, info) {

    if (info.status === 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

            let url = tabs[0].url;
            alert(url)
            alert(tracker_domains[0])

        });

    }
});
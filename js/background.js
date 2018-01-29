chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
				});
    }else if(details.reason == "update"){
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
				});
    }
});
$(function(){
    // window.jsonpCallback = alert;
    
    // let common = new Common();
    let numberOfFound =0;

    chrome.browserAction.setBadgeText({text: '' });
    
    chrome.storage.sync.get(['portNumber'], function (items){
        common.portNumber =(items.portNumber) ? items.portNumber :'80';
    });
    chrome.storage.sync.get(['plantsInConfig'],function (items){
        let plantsInConfigString = items.plantsInConfig + '';
        common.plantsInConfig = plantsInConfigString.split(',');
    });

    chrome.storage.onChanged.addListener(function(changes){
        //chrome.browserAction.setBadgeText({"text":changes.total.newValue.toString() });
        console.log('background onChanged:' + changes);
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if(request.resetNumberOfFound === true) {
            numberOfFound =0;
            chrome.browserAction.setBadgeText({text: '' });
        }
        if(request.numberOfFound > 0){
            numberOfFound = numberOfFound + request.numberOfFound;
            let badgeString = (numberOfFound>50)? "50+": numberOfFound +'';
            chrome.browserAction.setBadgeText({text: badgeString });
        }
        sendResponse({farewell: "goodbye"});
    });

    chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            // console.log(tabId);
            // console.log(changeInfo);
            // console.log(tab);
        }
    });

    chrome.alarms.onAlarm.addListener(function(alarm) {
        console.log('background onAlarm');
    });
    chrome.tabs.onActivated.addListener(function(activeInfo){
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            // let tabUrl = tab.url + ''; 
            // if(tabUrl.includes('localhost')) {
            //     chrome.contextMenus.update(menuOpenLocal,{"checked": true});
            //     chrome.contextMenus.update(menuOpenCd,{"checked": false});
            //     chrome.contextMenus.update(menuOpenBe,{"checked": false});
            // } else if(tabUrl.includes('.cd.vintriplant.com')) {
            //     chrome.contextMenus.update(menuOpenLocal,{"checked": false});
            //     chrome.contextMenus.update(menuOpenCd,{"checked": true});
            //     chrome.contextMenus.update(menuOpenBe,{"checked": false});
            // } else if(tabUrl.includes('.be.vintriplant.com')) {
            //     chrome.contextMenus.update(menuOpenLocal,{"checked": false});
            //     chrome.contextMenus.update(menuOpenCd,{"checked": false});
            //     chrome.contextMenus.update(menuOpenBe,{"checked": true});
            // }     
        });
    });


    // var contenxtMenuForPages = ["http://localhost/*", "https://*.vintriplant.com/*"];
    // var manuOpenDifferentEnvs = chrome.contextMenus.create({"title": "Open this page in", "documentUrlPatterns":contenxtMenuForPages});
    // var menuOpenLocal = chrome.contextMenus.create({"title": "Local", "parentId": manuOpenDifferentEnvs, "onclick": openInLocal, "type": "checkbox", "checked": false, "documentUrlPatterns":contenxtMenuForPages});
    // var menuOpenCd = chrome.contextMenus.create({"title": "CD", "parentId": manuOpenDifferentEnvs, "onclick": openInCd, "type": "checkbox", "checked": false,"documentUrlPatterns":contenxtMenuForPages});
    // var menuOpenBe = chrome.contextMenus.create({"title": "BE", "parentId": manuOpenDifferentEnvs, "onclick": openInBe, "type": "checkbox", "checked": false, "documentUrlPatterns":contenxtMenuForPages});


    function openInLocal(e){
        openNewTab('localhost');
    }

    function openInCd(e){
        openNewTab('cd');
    }

    function openInBe(e){
        openNewTab('be');
    }


    var openNewTab = function(targetEnv){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            let location = common.getLocation(currentTab.url);
            let hostNameWithProtocol = common.convertHostName(location,targetEnv,false);
            if(hostNameWithProtocol === null)
                return;

                let newUrl = hostNameWithProtocol + location.pathname + location.search;
            let index = currentTab.index;
            chrome.tabs.create({ url: newUrl, index: ++index });
        });
    }
});
$(function() {
   
    chrome.storage.sync.get(['portNumber'],function (items){
        appOption.portNumber = items.portNumber;
    });

    chrome.storage.sync.get(['plantsInConfig'],function (items){
        appOption.plantsInConfig = items.plantsInConfig;
    });


    var appOption = new Vue({ 
        el: '#optionDiv',
        data: {
            appName: 'wordSearch',
            appTitle: 'Search',
            appVersion: '0.9',
            //appLogoUrl:"images/logo_1.png",
            portNumber:'',
            plantsInConfig:''
        },
        methods: {
            saveOptions: function (event) {
                chrome.storage.sync.set({'portNumber': this.portNumber});
                chrome.storage.sync.set({'plantsInConfig': this.plantsInConfig});
                window.close();
            }
        }
    });
});

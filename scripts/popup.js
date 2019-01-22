 $(function() {
   chrome.storage.sync.get(['isDictionaryActive'],function (items){
        console.log(items);
        console.log(items.isDictionaryActive);
        console.log(appPopup);
        if(items.isDictionaryActive == undefined || items.isDictionaryActive == null) {
            appPopup.isDictionaryActive = false;
        } else {
            appPopup.isDictionaryActive = items.isDictionaryActive;
        }
    });

    var appPopup = new Vue({ 
        el: '#popupDiv',
        data: {
            appName: 'MyWordLookUp',
            appTitle: 'Word Look Up',
            appVersion: '0.9',
            appLogoUrl:"images/vintri-logo_1.png",
            isDictionaryActive: true,
        },
        watch: {
            isDictionaryActive: function(newValue, oldValue) {
                chrome.storage.sync.set({'isDictionaryActive': newValue});
            },
        },
        methods: {
            // saveOptionForActive: function (event) {
            //     console.log(this.isDictionaryActive);
            //     console.log(event);
            //     //chrome.storage.sync.set({'isDictionaryActive': this.isDictionaryActive});
            // }
        }
    });


 });

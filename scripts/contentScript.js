$(function () {
    // detect selection when mouse is up, which means double-click or drag text
    $("body").mouseup(function (e) {
        let selection = getSelected();
        if (selection && (selection = new String(selection).replace(/^\s+|\s+$/g, ""))) {
            let english = /^[A-Za-z0-9\-]*$/;
            if (english.test(selection)) {
                //console.log('english: ' + selection);
                if (selection.length < 15) {
                    chrome.storage.sync.get(['isDictionaryActive'], function (items) {
                        if (items.isDictionaryActive == undefined || items.isDictionaryActive == null) {
                            // do nothing no look up word
                            return;
                        }
                        if (items.isDictionaryActive === false) {
                            return;
                        }

                        searchWord(selection);

                    });
                }
            }
        }
    });

    window.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key == "Escape" || evt.key == "Esc");
        } else {
            isEscape = (evt.keyCode == 27);
        }

        if (isEscape) {
            let luwModals = document.getElementsByClassName("luw-modal"); // look up word model
            for (let i = 0; i < luwModals.length; i++) {
                luwModals[i].style.display = "none";
            }
        }
    };

    window.onclick = function (event) {
        let luwModals = document.getElementsByClassName("luw-modal"); // look up word model
        for (let i = 0; i < luwModals.length; i++) {
            luwModals[i].style.display = "none";
        }
    }

    $("<script>").attr("type", "text/javascript")
        // this script string is copied from subContentScript.js
        // .text('function jsonpCallback(data){ this.processData(data);  } function processData(data){ let searchWordPattern = \'|\' + data.rq + \'|\'; let finds = data.items.filter(function (item, i) { return item.includes(searchWordPattern.toLowerCase()); }); if (finds && finds.length > 0) { let tmp = finds[0].split("|"); let wordString = tmp[1] + ": " + tmp[2]; console.log(wordString); }}' )
        // custom
        .text('function jsonpCallback(data){ this.processData(data);  } function processData(data){ let searchWordPattern = \'|\' + data.rq + \'|\'; let finds = data.items.filter(function (item, i) { return item.includes(searchWordPattern.toLowerCase()); }); if (finds && finds.length > 0) { let tmp = finds[0].split("|"); let wordString = tmp[1] + ": " + tmp[2]; console.log(wordString); /* modal here */ let selection = window.getSelection();let range = selection.getRangeAt(0);let rect = range.getBoundingClientRect();let modal = document.createElement("div");modal.setAttribute("id", "myWordSearchModal");modal.setAttribute("class", "luw-modal");let modalContent = document.createElement("div");modalContent.setAttribute("class", "luw-modal-content");let modalBody = document.createElement("div");modalBody.setAttribute("class", "luw-modal-body");let modalContentP = document.createElement("p");let textnode = document.createTextNode(wordString);modalContentP.appendChild(textnode);modalBody.appendChild(modalContentP);modalContent.appendChild(modalBody);modal.appendChild(modalContent);document.body.appendChild(modal);modal.style.left = rect.left + "px";modal.style.top = rect.top + 18 + "px";modal.style.display = "block";  /* modal end*/}} ')
        // notifyjs
        // .text('$.getScript("https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.js"); function jsonpCallback(data){ this.processData(data);  } function processData(data) { let searchWordPattern = \'|\' + data.rq + \'|\'; let finds = data.items.filter(function (item, i) { return item.includes(searchWordPattern.toLowerCase()); }); if (finds && finds.length > 0) { let tmp = finds[0].split("|"); let wordString = tmp[1] + ": " + tmp[2]; console.log(wordString); $.notify(wordString, { className: "info", showDuration: 1000, position: "bottom left" }); }}'    )
        // alertifyjs
        //.text('$.getScript("https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.1/alertify.js"); function jsonpCallback(data){ this.processData(data);  } function processData(data) { let searchWordPattern = \'|\' + data.rq + \'|\'; let finds = data.items.filter(function (item, i) { return item.includes(searchWordPattern.toLowerCase()); }); if (finds && finds.length > 0) { let tmp = finds[0].split("|"); let wordString = tmp[1] + ": " + tmp[2];  console.log(wordString);  alertify.set("notifier","position", "bottom-left"); alertify.notify(wordString, "success", 5, function(){  console.log("dismissed"); }); }}'    )
        .appendTo("head");

});

function searchWord(word) {
    let queryUrl = "https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=" + word;
    queryUrl = queryUrl + (queryUrl.indexOf("?") >= 0 ? "&" : "?") + "callback=jsonpCallback";
    $.getScript(queryUrl, function () {});
}

function getSelected() {
    if (window.getSelection) {
        return window.getSelection();
    }

    if (document.getSelection) {
        return document.getSelection();
    }

    let selection = document.selection && document.selection.createRange();
    if (selection.text) {
        return selection.text;
    }
    return false;
}
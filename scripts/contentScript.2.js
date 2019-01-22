    //window['jsonpCallback'] = alert;
    // window.jsonpCallback = alert;
    $(function () {
        $('<script>')
          .attr('type', 'text/javascript')
          .text('function jsonpCallback(data){         console.log("jsonpCallback!!");        console.log(data);    }')
          .appendTo('head');
      })


    
   
    var wordSearchUrl=  'https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=';

    function searchWordAsync(word) {
        let queryUrl = wordSearchUrl + word;
        queryUrl = queryUrl +  (queryUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=jsonpCallback'
        // var script = document.createElement('script');
        // script.src = queryUrl +  (queryUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=jsonpCallback';
        // document.body.appendChild(script);
        $.getScript(queryUrl, function(e){
            console.log(e);
            alert(queryUrl);
        });
    }

    function searchWord(word) {
        let queryUrl = this.wordSearchUrl + word;
        this.jsonp(queryUrl, function (data) {
            let searchWordPattern = '|' + word + '|';
            let finds = data.items.filter(function (item, i) {
                let isFound = item.includes(searchWordPattern.toLowerCase());
                if (isFound === true) {
                    return true;
                }
                return false;
            })
            console.log('finds');
            console.log(finds);

            if (finds) {
                console.log('return finds');
                console.log(finds[0]);
                return finds[0];
            }
            return null;
            // var jsonString = JSON.stringify(data);
            // $("#subTitle").text(jsonString);
        });
    }



$(function () {
    //let contentScript = new ContentScript();
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

    $('body').mouseup(function (e) {
        let selection = getSelected();
        if (selection && (selection = new String(selection).replace(/^\s+|\s+$/g, ''))) {
            if (selection.length < 15) {
                searchWordAsync(selection);

                // contentScript.searchWordAsync(selection)
                //     .then(function (data) {
                //         let tmp = data.split("|");
                //         let wordString = tmp[1] +": " + tmp[2];
                //         $.notify(wordString,{ className:"info", showDuration: 1000, position: "bottom left" });
                //      })
                //     .catch(function (error) {
                //         console.log(error.message);
                //     });
            }
        }
    });

});
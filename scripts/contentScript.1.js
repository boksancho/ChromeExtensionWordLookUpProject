class ContentScript {
    constructor() {}

    // readonly property
    get wordSearchUrl() {
        return 'https://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=lan&q=';
    }

    // method
    jsonp(url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };

        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }

    searchWordAsync(word) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let queryUrl = that.wordSearchUrl + word;
            that.jsonp(queryUrl, function (data) {
                let searchWordPattern = '|' + word + '|';
                let finds = data.items.filter(function (item, i) {
                    let isFound = item.includes(searchWordPattern.toLowerCase());
                    if (isFound === true) {
                        return true;
                    }
                    return false;
                })

                if (finds) {
                    return resolve(finds[0]);
                }
                let reason = new Error('No found');
                reject(reason);
            });
        });
    }

    searchWord(word) {
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
}


$(function () {
    var ref = $('#button-a');        
    var popup = $('#popup');
    var popup2 = $('#popup2');
    popup2.hide();

        popup.hide();
    ref.click(function(){
        popup.show(); 
    });

    let contentScript = new ContentScript();
    $('[data-toggle="popover"]').popover();
    function getSelected() {
        if (window.getSelection) {
            return window.getSelection();
        } else if (document.getSelection) {
            return document.getSelection();
        } else {
            let selection = document.selection && document.selection.createRange();
            if (selection.text) {
                return selection.text;
            }
            return false;
        }
        return false;
    }


    $('#optionDiv').mouseup(function (e) {

        let selection = getSelected();
        let s = window.getSelection();      // get the selection then
        let range = s.getRangeAt(0);       // the range at first selection group
        let rect = range.getBoundingClientRect();
        let tooltipOptions = {
            container: 'body',
            html: true,
            selector: '#selectedWord',
            trigger: 'manual',
            title: function() {
                // here will be custom template
                //var id = $(this).parent().attr('id');
                // return 'Tooltip for row #' + id;
                return 'Tooltip for row #';
            }
        };
        
        if (selection && (selection = new String(selection).replace(/^\s+|\s+$/g, ''))) {
            if (selection.length < 15) {
                // console.log(e);
                //let wordFound = contentScript.searchWord(selection);
                contentScript.searchWordAsync(selection)
                .then(function (data) {
                        let tmp = data.split("|");
                        let wordString = tmp[1] +": " + tmp[2];
                        // $("#optionDiv").append('<div id="selectedWord" style="top: 281px; left: 900.5px; display: block;"></div>');
                        $.notify(wordString,"info",{showDuration: 1000 });
                        // $("#selectedWord").notify(data,"success");

                        // console.log(data);
                        // console.log(e.pageX);
                        // console.log(e.pageY);
                        // // document.getElementById('popup').style.display = 'block';
                        // $("#popup").text(data);
                        // $("#popup").css({left: e.pageX});
                        // $("#popup").css({top: e.pageY});
                        // $("#popup").show();
                        // var div = document.createElement('div');   // make box
                        // div.style.border = '2px solid black';      // with outline
                        // div.style.position = 'fixed';              // fixed positioning = easy mode
                        // // div.style.top = rect.top + 'px';       // set coordinates
                        // // div.style.left = rect.left + 'px';
                        // div.style.top = e.pageY + 'px';       // set coordinates
                        // div.style.left = e.pageX + 'px';
                        // div.style.height = rect.height + 'px'; // and size
                        // div.style.width = rect.width + 'px';
                        // div.setAttribute("id", "selectedWord");
                        // div.setAttribute("class", "wordPopup");
                        // div.setAttribute("style", "background:red");
                        // div.innerHTML = 'Hello';
                        // // div.setAttribute("data-toggle", "popover");
                        // // div.innerHTML = 'Extra stuff';
                        // // data-toggle="popover" 
                        // // document.body.appendChild(div);            // finally append
                        // document.getElementById('optionDiv').appendChild(div);   

                        // $('[data-toggle="popover"]').popover();
                        // $('#selectedWord').popover();
                        // $('div.wordPopup').popover();
                        
                        // $('div.wordPopup').tooltip(tooltipOptions);
                        // $('div.wordPopup').tooltip('show');
                        // $('#subTitle').tooltip(tooltipOptions);
                        // $('#subTitle').tooltip('show');

                        // tooltip.pop(div, '#manucoolPopup', {position:0, cssClass:'no-padding'})
                        
                        // $("#optionDiv").append('<div id="selectedWord" style="top: 281px; left: 900.5px; display: block;"></div>');
                        // var ref2 = $('#optionDiv');   
                        // ref2.alert();    
                        // var n = $('#optionDiv').noty({text: 'NOTY - a jquery notification library!'});
                        // popup2.text(data); 
                        // popup2.show(); 
                        // var popper2 = new Popper(ref2,popup2,{
                        //     placement: 'top',
                        //     onCreate: function(data){
                        //         console.log(data);
                        // },
                        // modifiers: {
                        //         flip: {
                        //                 behavior: ['left', 'right', 'top','bottom']
                        //         },
                        //         offset: { 
                        //                 enabled: true,
                        //                 offset: '0,10'
                        //         }
                        // }                                                
                        // });
                        
                        
                        
                     })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
        }
    });
});
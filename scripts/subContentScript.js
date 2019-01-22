function jsonpCallback(data) {
    this.processData(data);
}

function processData(data) {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();
    let modal = document.createElement("div");
    modal.setAttribute("id", "myWordSearchModal");
    modal.setAttribute("class", "luw-modal");
    let modalContent = document.createElement("div");
    modalContent.setAttribute("class", "luw-modal-content");
    let modalBody = document.createElement("div");
    modalBody.setAttribute("class", "luw-modal-body");
    let modalContentP = document.createElement("p");
    let textnode = document.createTextNode(wordString);
    modalContentP.appendChild(textnode);
    modalBody.appendChild(modalContentP);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.left = rect.left + "px";
    modal.style.top = rect.top + 18 + "px";
    modal.style.display = "block";
    // setTimeout(function(){ modal.style.display = "none"; } , 2000);
}

{/* <div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>Some text in the Modal..</p>
  </div>
</div> */}


// var modal = document.getElementById('myModal');
// // var btn = document.getElementById("myBtn");
// // var span = document.getElementsByClassName("close")[0];
// btn.onclick = function() {
//     modal.style.display = "block";
// }
// // span.onclick = function() {
// //     modal.style.display = "none";
// // }
// // window.onclick = function(event) {
// //     if (event.target == modal) {
// //         modal.style.display = "none";
// //     }
// // }


function processData(data) {
    let searchWordPattern = '|' + data.rq + '|';
    let finds = data.items.filter(function (item, i) {
        return item.includes(searchWordPattern.toLowerCase());
    })
    if (finds && finds.length > 0) {
        let tmp = finds[0].split("|");
        let wordString = tmp[1] + ": " + tmp[2];
        $.notify(wordString, {
            className: "info",
            showDuration: 1000,
            position: "bottom left"
        });
        alertify.notify("sample", "success", 5, function(){  console.log("dismissed"); });
    }
}

alertify.notify("sample", "success", 5, function(){  console.log("dismissed"); });
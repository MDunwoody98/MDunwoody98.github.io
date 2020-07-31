async function cycleImage(){
    var divNode = document.getElementsByClassName("images")[0];//get the images div
    var images = divNode.childNodes;//all child nodes of this
    for (let index = 0; index < images.length; index++) {
        var image = images[index];
        if (image.nodeType == 1){//ignore empty text nodes
            if (image.style.visibility == "visible"){
                await new Promise(r => setTimeout(r, 2000));//async function calls allow a setTimeout to be used
                image.style.visibility = "hidden";
                if (image.id =="image4"){
                    images[1].style.visibility = "visible";//loop from the beginning in this case
                }
                else{
                    images[index+2].style.visibility = "visible";//every other node is an image, interspaced with empty text nodes, hence the +2
                }
            }
        }
    }
}

$(document).ready(function(){
    $("div img").bind('click', function(){
        window.location.href = $(this).attr('href');//Simple JQuery script to add click event handler to all img tags in the div
    });
});
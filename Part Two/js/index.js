$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.materialboxed').materialbox();
    $('.tabs').tabs();
    $('.datepicker').datepicker({
        disableWeekends: true,
    });
    $('.tooltipped').tooltip();
    $('.scrollspy').scrollSpy();
    $('.parallax').parallax();
    $(window).scroll(function(){
        if($(window).scrollTop()>650){
            $('nav').removeClass('transparent');
            $('nav').addClass('blue');
            $('nav').addClass('lighten-2');
        }
        else{
            $('nav').removeClass('blue');
            $('nav').addClass('transparent');
            $('nav').addClass('lighten-2');
        }
    });
    $('.emailIcon').click(function($e) {
        $e.preventDefault();
        M.toast({html: 'Email client opened!',classes: 'indigo darken-4 rounded'});
    });
    $('button').click(function($e) {
        $e.preventDefault();
        M.toast({html: 'Message sent',classes: 'indigo darken-4 rounded'});
    });
    $('.halfway-fab').click(function($e) {
        $e.preventDefault();
        var toastHTML = '<span>Meal successfully added to favourites</span><button class="btn-flat toast-action">Undo</button>';
        M.toast({html: toastHTML,classes: 'indigo darken-4 rounded'});
    });
    $('.moreDetails').click(function($e){
        $e.preventDefault();
        M.toast({html: 'Detail pop up',classes: 'indigo darken-4 rounded'});
    })
});

window.addEventListener("load", function() {
	populateDestinations();
});
function populateDestinations() {
    var xmlhttp = new XMLHttpRequest();//Retrieve XML data. Need to use AJAX library to do this, but avoiding JQuery
    xmlhttp.open("get","data/destinations.xml",true);
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            showResult(this);
        }
    };
    xmlhttp.send(null);
}
function showResult(xmlhttp){
    var xmlDoc = xmlhttp.responseXML.documentElement;//Extract XML document from response object parameter
    removeWhiteSpace(xmlDoc);//Strip whitespace from XML document
    var cardSection = document.getElementById("cardElements");//Container element that will contain all our destinations
    var destinationData = xmlDoc.getElementsByTagName("Destination");//Grab the root node from XML
    addCardNodesFromXMLDoc(destinationData,cardSection);//Generate card elements from XML Data 
}
function removeWhiteSpace(xml){//Function that removes all non visible characters from XML and makes parsing easier since we're not using JQuery
    var loopIndex;
    for (loopIndex =0; loopIndex < xml.childNodes.length; loopIndex++){
        var currentNode = xml.childNodes[loopIndex];
        if (currentNode.nodeType ==1){
            removeWhiteSpace(currentNode);
        }
        if (!(/\S/.test(currentNode.nodeValue)) && currentNode.nodeType == 3){
            xml.removeChild(xml.childNodes[loopIndex--]);
        }
    }
}
function addCardNodesFromXMLDoc(xmlNodes,cardElements){
    var cardContainer = cardElements.parentNode;
    var newCard, newCardContent, secondPTag, thirdPTag, newCardInfo, newCardImage, i,j,xmlNodeCount,cardID,nameNode,image,imageNode,price,country;
    xmlNodeCount = xmlNodes.length;
    console.log("Number of nodes: "+ xmlNodeCount);
    for (i=0;i<xmlNodeCount;i++){
        newCard = document.createElement("div");//For each XML subnode of 'root', create a card element
        newCard.classList.add("card");
        for(j=0;j<xmlNodes[i].childNodes.length;j++){
            console.log(xmlNodes[i].childNodes[j].nodeName); //Log to check to see that nodes are coming through as expected
            console.log(xmlNodes[i].childNodes[j].firstChild.nodeValue); //Log to check to see that node values are coming through as expected
            if (xmlNodes[i].childNodes[j].nodeName =="image"){
                newCardImage = document.createElement("div");
                newCardImage.classList.add("card-image-container");
                image = name = xmlNodes[i].childNodes[j].firstChild.nodeValue;
                imageNode = document.createElement("img");
                imageNode.src = image;
                newCardImage.appendChild(imageNode);//Create image node
            }
            if (xmlNodes[i].childNodes[j].nodeName =="name"){
                nameNode = document.createTextNode(xmlNodes[i].childNodes[j].firstChild.nodeValue);
            }
            if (xmlNodes[i].childNodes[j].nodeName =="price"){
                price = document.createTextNode(xmlNodes[i].childNodes[j].firstChild.nodeValue);
            }
            if (xmlNodes[i].childNodes[j].nodeName =="country"){
                country = document.createTextNode(xmlNodes[i].childNodes[j].firstChild.nodeValue);
            }
        }
        cardID="card-number-"+i;
        newCardContent = document.createElement("div");
        newCardContent.classList.add("card-content");
        newPTag = document.createElement("p");
        newPTag.classList.add("card-title");
        newPTag.classList.add("text-medium");
        newPTag.appendChild(nameNode);
        
        newCardInfo = document.createElement("div");
        newCardInfo.classList.add("card-info");
        secondPTag = document.createElement("p");
        secondPTag.classList.add("text-medium");
        secondPTag.appendChild(country);
        
        thirdPTag = document.createElement("p");
        thirdPTag.classList.add("text-medium");
        thirdPTag.classList.add("card-price");
        thirdPTag.appendChild(price);

        newCardInfo.appendChild(secondPTag);
        newCardInfo.appendChild(thirdPTag);

        newCardContent.appendChild(newPTag);
        newCardContent.appendChild(newCardInfo);

        newCard.appendChild(newCardImage);
        newCard.appendChild(newCardContent);
        newCard.id=cardID;
        cardContainer.appendChild(newCard);
    }
}
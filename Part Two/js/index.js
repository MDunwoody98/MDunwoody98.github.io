$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.materialboxed').materialbox();
    $('.tabs').tabs();
    $('.datepicker').datepicker();
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
    $('#logInSubmit').click(function($e) {
        $e.preventDefault();
        toastMessage = validateLogIn();
        M.toast({html: toastMessage,classes: 'blue-grey rounded'});
    });
    $('#createSubmit').click(function($e) {
        $e.preventDefault();
        toastMessage = validateCreateAccount();
        M.toast({html: toastMessage,classes: 'blue-grey rounded'});
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
    for (i=0;i<xmlNodeCount;i++){
        newCard = document.createElement("div");//For each XML subnode of 'root', create a card element
        newCard.classList.add("card");
        for(j=0;j<xmlNodes[i].childNodes.length;j++){
            //console.log(xmlNodes[i].childNodes[j].nodeName); //Log to check to see that nodes are coming through as expected
            //console.log(xmlNodes[i].childNodes[j].firstChild.nodeValue); //Log to check to see that node values are coming through as expected
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
function validateLogIn(){
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    if (!validEmail(email))
        return "Please enter a valid email address";
    if (userExists(email, password))
        return "You have successfully logged in"
    return "Error. Email and Password do not match";//Don't check if the email exists as that can be used by hackers for enumeration
}

function validateCreateAccount(){
    var email = document.getElementById("createEmail").value;
    var password = document.getElementById("createPassword").value;
    var name = document.getElementById("nameInput").value;
    var dateOfBirth = new Date(document.getElementById("dateOfBirth").value);
    
    if (!validEmail(email))
        return "Error. Please enter a valid email address";
    if (!validPassword(password))
        return "Error. Please enter a valid password";
    if  (!validName(name))
        return "Error. Please enter a valid name that contains only text and is between 2 and 30 characters long";
    if (validDoB(dateOfBirth))
        return "Error. You must be 18 or over to create an account with us";
    if (userExists(email))
        return "Error. This email address is already in use"

    createAccount(email, password, name);//Only executes if prior conditions did not stop processing
    return "Account created successfully";
}

function validEmail(emailAddress) {//function stolen from practical 8 to validate email addresses
    var atLoc = emailAddress.indexOf("@", 1);
    var dotLoc = emailAddress.indexOf(".", atLoc + 2);
    var len = emailAddress.length;
    if (atLoc > 0 && dotLoc > 0 && len > dotLoc + 2)
        return true;
    return false;
}

function validName(name){
    var regex = /^[a-zA-Z ]{2,30}$/;//Regex to validate name is between 2 and 30 chars.
    return regex.test(name);
}

function validPassword(password){
    var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,60}$/;
    return regex.test(password);
}

function validDoB(dateOfBirth){//dateOfBirth is a date
    console.log(dateOfBirth);
    var ageDifference = Date.now() - dateOfBirth.getTime();
    console.log(new Date(ageDifference));
    
}

function userExists(email, password){
    return true;
}

function userExists(email){
    return true;
}

function isDate18orMoreYearsOld(day, month, year) {
    return new Date(year+18, month-1, day) <= new Date();
}
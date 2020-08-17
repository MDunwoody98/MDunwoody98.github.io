$(document).ready(function(){//initial materialize methods to make form responsive
    $('.sidenav').sidenav();
    $('.tooltipped').tooltip();
    $('.tabs').tabs();
    $('.slider').slider();
    var today = new Date();
    var startDate = new Date(today.setFullYear(today.getFullYear()-18));
    $('.datepicker').datepicker({
        autoClose: true,
        defaultDate: startDate,
        maxDate: startDate//Validation to ensure users cannot pick ages under 18 years
    });
    $('.scrollspy').scrollSpy();
    /*The below click functions and their toasts represent a client-side spoofing of a log-in system.
    The logic is fully validated and will produce the correct response depending on the values provided for each field */
    $('#logInSubmit').click(function($e) {
        $e.preventDefault();
        loginWrapper().then(function(toastMessage){
            M.toast({html: toastMessage,classes: 'blue-grey rounded'});//.then() function allows asynchronous processing
        });
    });
    $('#createSubmit').click(function($e) {
        $e.preventDefault();
        createAccountWrapper().then(function(toastMessage){
            M.toast({html: toastMessage,classes: 'blue-grey rounded'});//.then() function allows asynchronous processing
        });
    });
});

function checkLogin(loggedIn){//This function changes the nav bar to say "Log Out" if the user has logged in
    var loginSideNav = document.getElementById("loginStringMobile");
    var login = document.getElementById("loginString");
    if (loggedIn == true){
        login.innerHTML = "Log Out";
        loginSideNav.innerHTML = "Log Out";
        $('#loginForm').hide();

    }
    else {
        login.innerHTML = "Log In";
        loginSideNav.innerHTML = "Log In";
    }//Initially this used localStorage however the event handler was not reliable and calling a function was more worthwhile
}

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
            removeWhiteSpace(currentNode);//recursively remove whitespace
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
            if (xmlNodes[i].childNodes[j].nodeName =="image"){//If this is an image node
                newCardImage = document.createElement("div");
                newCardImage.classList.add("card-image-container");
                image = name = xmlNodes[i].childNodes[j].firstChild.nodeValue;//XML Node value (for image source)
                imageNode = document.createElement("img");
                imageNode.src = image;
                imageNode.alt = "tropical destination image";
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
        newPTag.appendChild(nameNode);//create div and p elements with required attributes
        
        newCardInfo = document.createElement("div");
        newCardInfo.classList.add("card-info");
        secondPTag = document.createElement("p");
        secondPTag.classList.add("text-medium");
        secondPTag.appendChild(country);//create div and p elements with required attributes
        
        thirdPTag = document.createElement("p");
        thirdPTag.classList.add("text-medium");
        thirdPTag.classList.add("card-price");
        thirdPTag.appendChild(price);//create p element with required attributes

        newCardInfo.appendChild(secondPTag);
        newCardInfo.appendChild(thirdPTag);//finalise card info div tag

        newCardContent.appendChild(newPTag);//card content has a p tag and a card info div tag
        newCardContent.appendChild(newCardInfo);

        newCard.appendChild(newCardImage);//card contains image and content
        newCard.appendChild(newCardContent);
        newCard.id=cardID;//assign id to each card
        cardContainer.appendChild(newCard);//add card to container in sequence
    }
}

async function loginWrapper(){
    var email = document.getElementById("loginEmail").value;//wrapper method for login button click
    var password = document.getElementById("loginPassword").value;
    let toastMessage = validateLogIn(email, password);
    return Promise.resolve(toastMessage);//return a promise that resolves to a string
}

async function validateLogIn(email, password){
    var toastMessage = "";
    var loggedIn = false;
    if (!validEmail(email)){//if email is not valid perform that check first
        toastMessage = "Please enter a valid email address";
    }
    else{
        var userAlreadyExists = await userExists(email, password);//if user already exists i.e. user/pass is valid
        if (userAlreadyExists){
            loggedIn = true;
            toastMessage = "You have successfully logged in";
        }
        else{
            toastMessage = "Error. Email and Password do not match";//Don't check if the email exists as that can be used by hackers for enumeration
        }
    }
    checkLogin(loggedIn);
    return toastMessage;
}

async function userExists(email, password){
    var validCredentials = false;
    let xmlhttp = await readUserFile(true);//asynchronous processing for improved performance
    var userNodes = xmlhttp.getElementsByTagName("user");//Get each user node
    userNodeCount = userNodes.length;
    for (i=0;i<userNodeCount;i++){
        for(j=0;j<userNodes[i].childNodes.length;j++){//for each child node of each user node
            if (userNodes[i].childNodes[j].nodeName =="emailAddress"){//if email address is the name of the node, add to an array
                if (userNodes[i].childNodes[j].firstChild.nodeValue == email && userNodes[i].childNodes[j+2].firstChild.nodeValue == password) {
                    validCredentials = true;
                }
            }
        }
    }
    return validCredentials;
}

async function createAccountWrapper(){//Wrapper method for including create account logic
    checkLogin(false);
    const toastMessage = await validateCreateAccount();
    return Promise.resolve(toastMessage);
}

async function validateCreateAccount(){
    var email = document.getElementById("createEmail").value;
    var password = document.getElementById("createPassword").value;
    var name = document.getElementById("nameInput").value;
    var dateOfBirth = new Date(document.getElementById("dateOfBirth").value);
    var confirmationCheckboxChecked = document.getElementById("confirmationCheckbox").checked;
    var year = dateOfBirth.getFullYear();
    var day = dateOfBirth.getDate();
    var month = dateOfBirth.getMonth();//Get all values from page
    
    if (!validEmail(email))
        toastMessage = "Error. Please enter a valid email address";//validate user
    else if (!validPassword(password))
        toastMessage = "Error. Passwords must be 6-60 characters in length, containing at least 1 lowercase and 1 uppercase letter, 1 number and 1 special character";//validate pw
    else if  (!validName(name))
        toastMessage = "Error. Please enter a valid name that contains only text and is between 2 and 30 characters long";//validate name
    else if (!validDoB(year, month, day))
        toastMessage = "Error. You must be 18 or over to create an account with us";//validate DoB
    else if (!confirmationCheckboxChecked)
        toastMessage = "Please check to confirm your details are correct";
    else {
        let emailAlreadyTaken = await emailInUse(email);
        if (!emailAlreadyTaken){//if email is not taken, we create account
            createAccount(email, password, name);
            toastMessage = "Account created successfully";   
        }
        else {
            toastMessage = "Error. Email address is already in use";//email is taken
        } 
    }
    
    return toastMessage;
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
    var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,60}$/;//6-60 chars, at least one upp case, number, and special char
    return regex.test(password);
}

function validDoB(year, month, day){//dateOfBirth is a date
    return new Date(year+18, month, day) <= new Date();//True if user is over 18
}

async function readUserFile(read){
    var xmlhttp = new XMLHttpRequest();//Retrieve XML data. Need to use AJAX library to do this, but avoiding JQuery
    return new Promise(function(resolve){
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                    if (read)
                        resolve(xmlhttp.responseXML.documentElement);//We cannot return data in an async function so we must resolve
                    else resolve(xmlhttp.responseXML);
                }
            }//using a Promise so that the return value is not undefined, as it needs time to read the file
        xmlhttp.open("get","data/users.xml",true);
        xmlhttp.send(null);
    });
}

async function emailInUse(email){
    var emailList = [];
    let xmlhttp = await readUserFile(true);//asynchronous processing for improved performance
    var userNodes = xmlhttp.getElementsByTagName("user");//Get each user node
    userNodeCount = userNodes.length;
    for (i=0;i<userNodeCount;i++){
        for(j=0;j<userNodes[i].childNodes.length;j++){//for each child node of each user node
            if (userNodes[i].childNodes[j].nodeName =="emailAddress"){//if email address is the name of the node, add to an array
                emailList.push(userNodes[i].childNodes[j].firstChild.nodeValue);
            }
        }
    }
    return emailList.includes(email);
}

async function createAccount(email, password, name){
    let xmlhttp = await readUserFile(false);
    var newUserNode = xmlhttp.createElement("user");

    var newEmailNode = xmlhttp.createElement("emailAddress");//create email XML node
    var newEmailTextNode = document.createTextNode(email);
    newEmailNode.appendChild(newEmailTextNode);

    var newPasswordNode = xmlhttp.createElement("password");//create password XML node
    var newPasswordTextNode = document.createTextNode(password);
    newPasswordNode.appendChild(newPasswordTextNode);

    var newNameNode = xmlhttp.createElement("name");//create name xml node
    var newNameTextNode = document.createTextNode(name);
    newNameNode.appendChild(newNameTextNode);

    newUserNode.appendChild(newEmailNode);//append all these nodes to be children of user node
    newUserNode.appendChild(newPasswordNode);
    newUserNode.appendChild(newNameNode);
    var data = xmlhttp.getElementsByTagName("data")[0];//get whole XML file
    data.appendChild(newUserNode);
    console.log(data);
    /*
        JavaScript in browser does not allow writing to file system for security reasons (rightly so), so this code here
        is a demonstration of how a server-side XML database would be updated by the existing logic. If we had permissions to add
        the new user nodes to the files on the server, the above console log shows how the logic exists and is working.

        This is meant to be a demonstration/spoof of a live XML back end while keeping all logic client-side. It is for demonstration
        purposes only and is not meant to represent ideal security, which would be server side.
    */
}
try {
    module.exports = {//export functions for jest testing
        loginWrapper: loginWrapper,
        validateLogIn: validateLogIn,
        userExists: userExists,
        readUserFile: readUserFile,
        validEmail: validEmail,
        validDoB: validDoB,
        validPassword: validPassword,
        validName: validName,
        emailInUse: emailInUse,
        createAccount: createAccount,
        createAccountWrapper: createAccountWrapper,
        validateCreateAccount: validateCreateAccount,
    }
} catch (error) {
    //this is just being used to suppress browser error for 'module' not being defined
}

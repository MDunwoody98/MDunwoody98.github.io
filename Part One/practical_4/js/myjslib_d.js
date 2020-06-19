function displayName() {
    var name = document.getElementsByTagName('input')[0].value;//Get the text value of the first element of type input
    if (name.length > 0){
        var element = document.getElementById("display");
    if (element) {
        element.parentNode.removeChild(element);//Remove existing display node if exists
    } 
    var newPTag = document.createElement('p');//create a p tag
    var course = document.getElementById("course").value;
    var campus = document.getElementById("campus").value;
    var university = document.getElementById("university").value;
    var welcomeMessage = name + ", welcome to the JavaScript homepage!\n"+"You are a a third year "+ course + " student in " + university + " at " + campus;
    var newText = document.createTextNode(welcomeMessage);//Create a text node using the value of 'name
    newPTag.appendChild(newText);//Assign this text node to the p tag we created
    newPTag.id = "display";//Give this tag an id of 'display'
    var position = document.getElementsByTagName('body')[0];//Get the position of the body tag
    position.appendChild(newPTag);//Append this p tag as a new child node to the body tag
    }
    
}
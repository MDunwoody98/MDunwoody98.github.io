var form = document.getElementById("userSurvey");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);//I added this code to stop the submit buttom from resetting all the text fields

function validChoice() {
  var bookChoice = "";
  var x = "";
  for (i = 0; i < 4; i++) {
    if (document.userSurvey["bookChoice" + i].checked) {
      bookChoice = document.userSurvey["bookChoice" + i].value;
      x = x + "\n" + bookChoice; //"\n" output a newline
    }
  }
  if (bookChoice == "") {
    window.alert("You must select at least one book category.");
    return false; //I added the return false
  } else {
    var userName = document.userSurvey.userName.value;
    var eMail = document.userSurvey.eMail.value;
    var phoneNo = document.userSurvey.phone.value;
    var infoString =
      "Name: " + userName + "\nEmail: " + eMail + "\nPhone: " + phoneNo + "\n\naBook genres:"+x;//insert a statement here so that the values of username, email, phoneNo and the book selected will be display in the textarea;
    var textArea = document.getElementsByTagName("textarea")[0];
    textArea.value = infoString;
    
    return true;
  }
}

function validEmail() {
  if (!document.userSurvey.eMail.value) {
    window.alert(
      "E-mail Address missing. Please enter a valid E-mail address to continue."
    );
    document.userSurvey.eMail.focus();
    return false;
  } else {
    var emailAddress = document.userSurvey.eMail.value;
    var atLoc = emailAddress.indexOf("@", 1);
    var dotLoc = emailAddress.indexOf(".", atLoc + 2);
    var len = emailAddress.length;
    if (atLoc > 0 && dotLoc > 0 && len > dotLoc + 2) {
      return true;
    } else {
      alert("Invalid E-mail address! Please enter your e-mail address again.");
      document.userSurvey.eMail.focus();
      return false;
    }
  }
}

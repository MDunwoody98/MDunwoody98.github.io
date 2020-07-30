function validNo() {
  if (!document.userSurvey.phone.value) {
    window.alert(
      "Phone number missing. Please enter a valid phone number to continue.");
    document.userSurvey.phone.focus();
    return false;
  } else {
    var numbersOnly = "";
    var chars = "";
    var phoneNo = document.userSurvey.phone.value;
    for (i = 0; i < phoneNo.length; i++) {
      chars = phoneNo.substring(i, i + 1);
      if (chars >= "0" && chars <= "9") {
        numbersOnly = numbersOnly + chars;
      }
    }
    if (numbersOnly.length != 13) {
      window.alert("Incorrect phone number format.You must enter 13 numbers.");
      document.userSurvey.focus();
      return false;
    } else {
      var areacode = numbersOnly.substring(0, 2);
      var leading0 = numbersOnly.substring(2, 3);
      var exchange = numbersOnly.substring(3, 5);
      var ext1 = numbersOnly.substring(5, 9);
      var ext2 = numbersOnly.substring(9);
      var newNumber =
        "+" +
        areacode +
        " " +
        "(" +
        leading0 +
        ")" +
        exchange +
        " " +
        ext1 +
        "-" +
        ext2;
      document.userSurvey.phone.value = newNumber;
      console.log(newNumber);
      return true;
    }
  }
}

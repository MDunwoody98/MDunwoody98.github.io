function getSelectValue(formname,selectname){
    var theMenu = document[formname][selectname];
    var selecteditem = theMenu.selectedIndex;
    return theMenu.options[selecteditem].value;
}

function generateResults(){
    var score = 0;
    var correctAnswers = ["EXtensible HyperText Markup Language","<p></p>","<br />"];
    for (let i = 1; i < 4; i++) {
        if(correctAnswers[i-1] == getSelectValue("myQuizForm","select"+i)){
            score++;//If the user's choice for the select statements match the corresponding correct answer, increment score
        }
    }
    var scoreBox = document.getElementById("results");
    scoreBox.value = score;
}
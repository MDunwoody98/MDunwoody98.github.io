var universityNames = ['Queens University','Ulster University'];
var ulsterCampusNames = ['Jordanstown','Coleraine','Magee','Belfast'];
var courseNames = ['Software Engineering','Computer Science','Interactive Multimedia Design','Information Communication Technology'];
var text = "I'm a third year "+courseNames[1] + " student in " + universityNames[1] + " at " + ulsterCampusNames[0];

function displayText(inputtext){
    window.document.write(inputtext);
}
displayText(text);
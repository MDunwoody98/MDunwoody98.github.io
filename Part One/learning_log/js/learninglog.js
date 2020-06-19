var colls = document.getElementsByClassName("collapsible");

for (let i = 0; i < colls.length; i++) {
  colls[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
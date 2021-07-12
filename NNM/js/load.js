function loadDoc(id,page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(id).innerHTML =
                this.responseText;
        }
    };
    xhttp.open("GET",page, true);
    xhttp.send();
}

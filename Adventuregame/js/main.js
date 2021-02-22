function keypress(e,element,output){
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that runs
        let out = document.getElementById(output);
        out.value +=  element.value;
        element.value = ""
        out.scrollTop = out.scrollHeight;
    }
}
document.getElementById('output').value = '';
document.getElementById('command').focus();;
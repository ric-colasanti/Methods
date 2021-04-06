console.log("loaded");

function listRefs(dir,elm) {
    // get auto-generated page 
    console.log(dir,elm);
    $.ajax({
        url: dir
    }).then(function (html) {
        // create temporary DOM element
        elem.innerHTML +="<ul>"
        var document = $(html);
        // find all links ending with .pdf 
        count=1
        elm.innerHTML="<ul >";
        document.find('a[href$=".pdf"]').each(function () {
            var name = $(this).text().split(".pdf")[0];
            var url = $(this).attr('href');
            elm.innerHTML+="<li >["+count+"] <a href='"+url+"'>"+name+"</a></li>";
            count++;
        })
        elm.innerHTML+="</ul>";
    });
}


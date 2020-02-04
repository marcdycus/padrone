$("#scrape").on("click", function(){
    $.getJSON("/movies", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#movies").append(
            "<div class='movies' data-id='" + data[i]._id + "'>"
                +"<h3><a target=new href=" + data[i].link + " >"
                 + data[i].movieTitle + "</a></h3>"
                 +"<button data-id='" + data[i]._id + "'>Notes</button>"
                 +"<br /><p>R.T. Rating: " + data[i].rating + "</p>"
                 +"<img src=" + data[i].posterImg + "></div>"
        );
    }
    // console.log(data);
});



$(document).on("click", "button", function() {
    $("#notes").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/movies/" + thisId
    }).then(function(data) {
        console.log(data);

    $("#notes").append("<h2>" + data.movieTitle + "</h2>");
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    
    if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
    }
    });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/movies/" + thisId,
        data: {
            title: $('#titleinput').val(),
            body: $("#bodyinput").val()
        }
    }) 
    .then(function(data) {
        console.log(data);
        $("#notes").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

});
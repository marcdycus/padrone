$.getJSON("/movies", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#movies").append("<div data-id='" + data[i]._id + "'><a target=new href=" + data[i].link + ">" + data[i].movieTitle + "</a><br />" + data[i].rating + "<br /></div><img src=" + data[i].posterImg + ">");
    }
    // console.log(data);
});

// $(document).on("click", "p", function() {
//     $("#notes").empty();

//     var thisId = $(this).attr("data-id");

//     $.ajax({
//         method: "GET",
//         url: "/movies" + thisId
//     }).then(function(data) {
//         console.log(data);

//     $("#notes").append("<h2>" + data.movieTitle + "</h2>");
//     $("#notes").append("<input id='titleinput' name='title' >");
//     $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//     $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    
//     if (data.note) {
//         $("#titleinput").val(data.note.movieTitle);
//         $("#bodyinput").val(data.note.body);
//     }
//     });
// });
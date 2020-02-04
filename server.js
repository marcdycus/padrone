var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://marcdycus:password1@ds061661.mlab.com:61661/heroku_719mtbv4";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + './public/index.html'));
});

app.get("/scrape", function(req, res) {
    axios.get("https://editorial.rottentomatoes.com/guide/best-netflix-movies-to-watch-right-now/").then(function(response) {
        var $ = cheerio.load(response.data);
        
        $(".countdown-item").each(function(i, element) {
            var results = {};

            results.movieTitle = $(element)
                .find("h2 a")
                .text();
            results.posterImg = $(element)
                .find(".article_poster")
                .attr("src");
            results.rating = $(element)
                .find(".tMeterScore")
                .text();
            results.link = $(element)
                .find('h2 a')
                .attr("href");

            db.Movie.create(results)
            .then(function(dbMovie) {
                // console.log(dbMovie);
            })
            .catch(function(err) {
                console.log(err)
            });
        });

        // res.send("Scrape Complete");
        
    });
});

app.get("/movies", function(req, res) {
    db.Movie.find({})
        .then(function(dbMovie) {
            // console.log(dbMovie);
            res.json(dbMovie);
        })
        .catch(function(err) {
            res.json(err)
        });
});

app.get("/movies/:id", function(req, res) {
    db.Movie.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbMovie) {
        res.json(dbMovie);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/movies/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Movie.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function(dbMovie) {
            res.json(dbMovie);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.delete("/movies/:id", function(req, res) {
    db.Movie.findOneAndRemove({ _id: req.params.id })
    .then(function(dbNote) {
        return db.Movie.findOneAndUpdate({ _id: req.params.id }, { $pull: { note: dbNote._id } }, { new: true });
    })
    .then(function(dbMovie) {
        res.json(dbMovie);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/clearall", function(req, res) {
    db.Movie.remove({}, function(error, response) {
      // Log any errors to the console
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(response);
        // res.send(response);
        // res.sendFile(path.join(__dirname + './public/index.html'));
      }
    });
  });
  

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
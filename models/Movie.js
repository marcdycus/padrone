var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    posterImg: {
        type: String,
        required: true
    },
    movieTitle: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
	movie:String,
	movieid:String,
	img:String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("comment", commentSchema);
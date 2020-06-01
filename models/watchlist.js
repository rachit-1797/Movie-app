var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology",true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/mov",{
	useCreateIndex: true,
	useNewUrlParser:true});
var watchlistSchema = new mongoose.Schema({
    name:String,
	img:String,
	id:String,
	description:String
});


module.exports = mongoose.model("watchlist", watchlistSchema);
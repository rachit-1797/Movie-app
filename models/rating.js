var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology",true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/mov",{
	useCreateIndex: true,
	useNewUrlParser:true});
var ratingSchema = new mongoose.Schema({
    id: String,
	rating:Number
});


module.exports = mongoose.model("rating", ratingSchema);
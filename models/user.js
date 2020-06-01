var mongoose = require("mongoose");
 var passportLocalMongoose = require("passport-local-mongoose");

mongoose.set("useUnifiedTopology",true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/mov",{
	
	useNewUrlParser:true});
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
	watchlist:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "watchlist"
		}
	],
	favourate:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "favourate"
		}
		],
	comment:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "comment"
		}
		],
	rating:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "rating"
		}
		]
});


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
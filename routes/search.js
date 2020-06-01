var express=require("express");
var router =express.Router();
var i                = 1;
var request          = require('request');
router.post("/movies/search", function(req, res){
var name = req.body.movies;
var parsedData;
var url="https://api.themoviedb.org/3/search/movie?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&query="+name+"&page=1&include_adult=false"
request(url ,function(error,response,body){
if(!error&&response.statusCode==200)
{
   parsedData=JSON.parse(body)
	console.log(parsedData);
	res.render('search',{parsedData:parsedData});
   }
});

});

module.exports=router;

	
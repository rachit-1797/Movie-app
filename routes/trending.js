var express=require("express");
var router =express.Router();
var request          = require('request');
var i                = 1;
//--trending page start --//
//--next page on trending page request--//
	router.get("/movies/trending/next",function(req,res)
	   {
	i++;
	var parsedData;
	var url = new URL('https://api.themoviedb.org/3/movie/popular?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&page=1');
	var search_params = url.searchParams;
	search_params.set('page',i);
	url.search = search_params.toString();
	var new_url = url.toString();
	console.log(new_url);
	request(new_url,function(error,response,body){
	if(!error&&response.statusCode==200)
	{
	   parsedData=JSON.parse(body)
	  res.render('trending',{parsedData:parsedData});
	}
	});
	});
//--next page on trending page request end--//
//--next page on trending page request--//
	router.get("/movies/trending/previous",function(req,res)
	   {
	if(i>1)
	i--;
	var parsedData;
	var url = new URL('https://api.themoviedb.org/3/movie/popular?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&page=1');
	var search_params = url.searchParams;
	search_params.set('page',i);
	url.search = search_params.toString();
	var new_url = url.toString();
	console.log(new_url);
	request(new_url,function(error,response,body){
	if(!error&&response.statusCode==200)
	{
	   parsedData=JSON.parse(body)
	  res.render('trending',{parsedData:parsedData});
	}
	});
	});
//--next page on trending pages request end --//
//-- 1st trending page request--//
	router.get("/movies/trending",function(req,res){i=1;
	var parsedData
	 request(" https://api.themoviedb.org/3/trending/movie/week?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&page=1",function(error,response,body){
	if(!error&&response.statusCode==200)
	{
	   parsedData=JSON.parse(body)
	   res.render('trending',{parsedData:parsedData});
	}
	});
	});
//-- 1st trending page request end--//

//-----trending end//
module.exports=router;
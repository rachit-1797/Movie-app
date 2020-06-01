var express=require("express");
var router =express.Router();
var i                = 1;
var request          = require('request');
router.get("/movies/mostpopular/next",function(req,res)
   {
i++;
var parsedData;
var url = new URL('https://api.themoviedb.org/3/movie/popular?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&page=1');
var search_params = url.searchParams;
search_params.set('page',i);
url.search = search_params.toString();
var new_url = url.toString();
//console.log(new_url);
request(new_url,function(error,response,body){
if(!error&&response.statusCode==200)
{
   parsedData=JSON.parse(body)
  res.render('trending',{parsedData:parsedData});
}
});
});
//--next page on mostpopular page request end--//
//--main page on mostpopular page request--//
router.get("/movies/mostpopular/previous",function(req,res)
   {
if(i>1)
i--;
var parsedData;
var url = new URL('https://api.themoviedb.org/3/movie/popular?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&page=1');
var search_params = url.searchParams;
search_params.set('page',i);
url.search = search_params.toString();
var new_url = url.toString();
//console.log(new_url);
request(new_url,function(error,response,body){
if(!error&&response.statusCode==200)
{
   parsedData=JSON.parse(body)
  res.render('trending',{parsedData:parsedData});
}
});
});
//--main page on mostpopular pages request end --//
router.get("/movies/mostpopular",function(req,res){i=1;
var parsedData
 request("https://api.themoviedb.org/3/movie/trending?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US&page=1",function(error,response,body){
if(!error&&response.statusCode==200)
{
   parsedData=JSON.parse(body)

   res.render('trending',{parsedData:parsedData});
}

});
});
module.exports=router;
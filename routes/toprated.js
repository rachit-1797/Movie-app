var express=require("express");
var router =express.Router();
var request          = require('request');
var i                = 1;
router.get("/movies/toprated/next",function(req,res)
{
i++;
var parsedData;
var url = new URL('https://api.themoviedb.org/3/movie/top_rated?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=enUS&page=1');
var search_params = url.searchParams;
search_params.set('page',i);
url.search = search_params.toString();
var new_url = url.toString();
console.log(new_url);
request(new_url,function(error,response,body){
if(!error&&response.statusCode==200)
{
parsedData=JSON.parse(body)
res.render('toprated',{parsedData:parsedData});
}
});
});
//--next page on toprated page request end--//
//--next page on toprated page request--//
router.get("/movies/toprated/previous",function(req,res)
{
if(i>1)
i--;
var parsedData;
var url = new URL('https://api.themoviedb.org/3/movie/top_rated?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=enUS&page=1');
var search_params = url.searchParams;
search_params.set('page',i);
url.search = search_params.toString();
var new_url = url.toString();
console.log(new_url);
request(new_url,function(error,response,body){
if(!error&&response.statusCode==200)
{
parsedData=JSON.parse(body)
res.render('toprated',{parsedData:parsedData});
}
});
});
//--next page on toprated pages request end --//
router.get("/movies/toprated",function(req,res){i=1;
var parsedData
 request("https://api.themoviedb.org/3/movie/top_rated?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=enUS&page=1",function(error,response,body){
if(!error&&response.statusCode==200)
{
   parsedData=JSON.parse(body)
   res.render('toprated',{parsedData:parsedData});
}
});
});
//-----toprated end//
module.exports=router;
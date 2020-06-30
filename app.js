var request          = require('request');
var express          = require('express');
var flash			 = require('connect-flash');
var app              = express();
var bodyParser       = require("body-parser")
var methodOverride	 = require("method-override")
var mongoose         = require("mongoose")
var passport         = require("passport")
var LocalStrategy    = require("passport-local")
var User             = require("./models/user")
var watchlist		 = require("./models/watchlist")
var favourate		 = require("./models/favourate")
var rating         = require("./models/rating")
var comment          =require("./models/comments")
var i                = 1;
var g				 = 1;
var topratedroutes   = require("./routes/toprated")
var upcomingroutes   = require("./routes/upcoming")
var trendingroutes   = require("./routes/trending")
var moviesroutes     = require("./routes/movies")
var mostpopularroutes= require("./routes//mostpopular")
var searchroutes     = require("./routes/search")
var authenticate	 = require("./routes/authenticate")
const nodemailer = require('nodemailer');
mongoose.set("useUnifiedTopology",true);
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(flash());
mongoose.connect("mongodb+srv://akshit:akshit%231744@cluster0-cks3q.mongodb.net/test?retryWrites=true&w=majority",{
	
	useNewUrlParser:true,
	useCreateIndex:true
});

app.use(bodyParser.urlencoded({extended: true}));
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
    res.locals.moviesuccess=req.flash("moviesuccess");
   next();
});
//  ===========
// AUTH ROUTES
//  ===========
// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
			  req.flash("error",err.message+"!!");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success","Hurrah,You have successfully registred and logged in as "+ req.body.username+" !!")
           res.redirect("/movies"); 
        });
    });
});
// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
{
        successRedirect: "/profile",
        failureRedirect: "/login"
    }), function(req, res){
	
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error","Please login to continue!!");
    res.redirect("/login");
}
// profile page routes
	app.get("/profile",isLoggedIn,function(req,res){
		var y=req.user.username;
	User.findOne({username:y},function(err,user1){
		User.findOne({username:y}).populate("watchlist").exec(function(err,user){
		if(err){
			
		}else{
		console.log(user.watchlist.length);
		User.findOne({username:y}).populate("favourate").exec(function(err,user1){
			
		res.render("profile",{wlen:user.watchlist.length,flen:user1.favourate.length});
		});
		}
		});
	});
});
app.get("/rating",isLoggedIn,function(req,res){
	var y=req.user.username;
	User.findOne({username:y}).populate("rating").exec(function(err,user){
		if(err){
			
		}else{
			res.render("rating",{rating:user.rating});
		}
	});
	
	});
 app.post("/rating/:id",isLoggedIn, function(req, res){
	var x=req.user.username;
	g=1;
	var val= req.body.Rate;
	var id = req.params.id;
	var id1=id;
	var data;
	var url="https://api.themoviedb.org/3/movie/" +id+ "?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US";
	
	request(url,function(error,response,body){

	if(!error&&response.statusCode==200)
	{
   		data=JSON.parse(body);
		var name=data.original_title,
	    id=data.id,img=data.poster_path,
		description=data.overview
		var newmovie={name:name,id:id,img:img,rating:val}
		rating.create(newmovie,function(err,new_update){	
			if(err){
            	console.log(err);
        	} 
			else {
            //redirect back to campgrounds page
            	//console.log(new_update);
				User.findOne({username:x},function(err,founduser){
					if(err){
						console.log("cannot find  loggesd in user in database");
					}
					else{
						founduser.rating.push(new_update);
						founduser.save(function(err,data){
						if(err){
							console.log("error in saving your watchlist data");
						}else{
							//console.log(data);
							var url="/movies/search/"+id1;
							//console.log(url);
							req.flash("moviesuccess","Your Rating has been recorded!!");
							res.redirect(url);
						}
					});
				}
			});
				
		}
    });
				
					  
			
	
	}
		
	});
	});
// watchlist-------
//-----------------------
app.post("/remove/fromwatchlist/:id",isLoggedIn,function(req,res){
	console.log(req.params.id);
	g=0;
	var id1;
	
	var y=req.user.username;
	console.log(req.user);
	watchlist.findById(req.params.id,function(err,movie){
		id1=movie.id;
		
	
	watchlist.findByIdAndRemove(req.params.id,function(error,movie1){
		var url="/movies/search/"+id1;
		req.flash("moviesuccess","Successfully removed the movie from your watchlist!!");
		res.redirect(url);
	})	
	})
});
app.get("/watchlist",isLoggedIn,function(req,res){
	var y=req.user.username;
	User.findOne({username:y}).populate("watchlist").exec(function(err,user){
		if(err){
			
		}else{
			console.log(watchlist);
			req.flash("moviesuccess","Successfully removed the movie from your watchlist!!");
			res.render("watchlist",{watchlist:user.watchlist});
		}
	});
	
	});
app.get("/watchlist/:id",isLoggedIn,function(req,res)
{
	var x=req.user.username;
	g=1;
	var id = req.params.id;
	var id1=id;
	var data;
	var url="https://api.themoviedb.org/3/movie/" +id+ "?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US";
	
	request(url,function(error,response,body){

	if(!error&&response.statusCode==200)
	{
   		data=JSON.parse(body);
		//console.log("got json!!!")
		//console.log(req.user.username);
		//console.log("/movies/search/545");
		//console.log(data);
		var name=data.original_title,
	    id=data.id,img=data.poster_path,
		description=data.overview
		var newmovie={name:name,id:id,img:img,description:description}
		watchlist.create(newmovie,function(err,new_update){	
			if(err){
            	console.log(err);
        	} 
			else {
            //redirect back to campgrounds page
            	//console.log(new_update);
				User.findOne({username:x},function(err,founduser){
					if(err){
						console.log("cannot find  loggesd in user in database");
					}
					else{
						founduser.watchlist.push(new_update);
						founduser.save(function(err,data){
						if(err){
							console.log("error in saving your watchlist data");
						}else{
							//console.log(data);
							var url="/movies/search/"+id1;
							//console.log(url);
							req.flash("moviesuccess","Successfully added the movie to your watchlist!!");
							res.redirect(url);
						}
					});
				}
			});
				
		}
    });
				
					  
			
	
	}
		
	});
	
});
// favourate
//-----------------
app.post("/remove/fromfavourate/:id",isLoggedIn,function(req,res){
	console.log(req.params.id);
	g=0;
	var id1;
	
	var y=req.user.username;
	console.log(req.user);
	favourate.findById(req.params.id,function(err,movie){
		id1=movie.id;
		
	
	favourate.findByIdAndRemove(req.params.id,function(error,movie1){
		var url="/movies/search/"+id1;
		req.flash("moviesuccess","Successfully removed the movie from your watchlist!!");
		res.redirect(url);
	})	
	})
});
app.get("/favourate",isLoggedIn,function(req,res)
{
	var y=req.user.username;
	User.findOne({username:y}).populate("favourate").exec(function(err,user){
		if(err){
			
		}else{
			console.log(favourate);
			res.render("favourate",{favourate:user.favourate});
		}
	});
	
});

app.get("/favourate/:id",isLoggedIn,function(req,res)
{
	var x=req.user.username;
	g=1;
	var id = req.params.id;
	var id1=id;
	var data;
	var url="https://api.themoviedb.org/3/movie/" +id+ "?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US";
	
	request(url,function(error,response,body){

	if(!error&&response.statusCode==200)
	{
   		data=JSON.parse(body);
		//console.log("got json!!!")
		//console.log(req.user.username);
		//console.log("/movies/search/545");
		//console.log(data);
		var name=data.original_title,
	    id=data.id,img=data.poster_path,
		description=data.overview
		var newmovie={name:name,id:id,img:img,description:description}
		favourate.create(newmovie,function(err,new_update){	
			if(err){
            	console.log(err);
        	} 
			else {
            //redirect back to campgrounds page
            	//console.log(new_update);
				User.findOne({username:x},function(err,founduser){
					if(err){
						console.log("cannot find  loggesd in user in database");
					}
					else{
						founduser.favourate.push(new_update);
						founduser.save(function(err,data){
						if(err){
							console.log("error in saving your favourate data");
						}else{
							//console.log(data);
							var url="/movies/search/"+id1;
							//console.log(url);
							req.flash("moviesuccess","Successfully added the movie to your favourate!!");
							res.redirect(url);
						}
					});
				}
			});
				
		}
    });
				
					  
			
	
	}
		
	});
	
});
//home 
app.post("/comments/:id",isLoggedIn,function(req,res)
{
	var x=req.user.username;
	
	var id = req.params.id;
	var id1=req.params.id;
	var data;
	var url="https://api.themoviedb.org/3/movie/" +id+ "?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US";
	var text=req.body.comment;
	console.log(text)
	request(url,function(error,response,body){

	if(!error&&response.statusCode==200)
	{
   		data=JSON.parse(body);
		
		var movie=data.original_title
		var movieid=data.id
		var author=req.user._id
		var img=data.poster_path
		var username=req.user.username;
		var authorid = req.user._id;
               
		
	    
		var newcomment={text:text,movie:movie,movieid:movieid,img:img,}
		       
		
		comment.create(newcomment,function(err,newcomment){	
			if(err){
            	console.log(err);
        	} 
			else {
            //redirect back to campgrounds page
            	
			    newcomment.author.id = req.user._id;
                newcomment.author.username = req.user.username;
				newcomment.save()
				console.log(newcomment);
				User.findOne({username:x},function(err,founduser){
					if(err){
						console.log("cannot find  loggesd in user in database");
					}
					else{
						founduser.comment.push(newcomment);
						founduser.save(function(err,data){
						if(err){
							console.log("error in saving your favourate data");
						}else{
							//console.log(data);
							var url="/movies/search/"+id1;
							//console.log(url);
							res.redirect(url);
						}
					});
				}
			});
				
		}
    });
    }
	});
});
app.get("/comments",isLoggedIn,function(req,res)
{
	var y=req.user.username;
	User.findOne({username:y}).populate("comment").exec(function(err,user){
		if(err){
			
		}else{
			console.log(user.comment);
			res.render("comment",{comment:user.comment});
		}
	});
	
});

app.get("/movies/search/:id",isLoggedIn,function(req,res){
	var id = req.params.id;
	var data;
	var previous
    var url="https://api.themoviedb.org/3/movie/" +id+ "?api_key=bf63276b9aa2afdd6dd932ce83d82ab1&language=en-US";
	var y=req.user.username;
	var x=0;
	var z=0;
User.findOne({username:y}).populate("watchlist").exec(function(err,user){
		if(err){
			
		}else{
		//console.log(user.watchlist);
		for(var j=0;j<user.watchlist.length;j++)
				{if(user.watchlist[j].id==id)
						{
							x=1;
						}
					}}
	//console.log(x);
    });
	//console.log(x);
	
request(url,function(error,response,body){
if(!error&&response.statusCode==200)
{
   data=JSON.parse(body);
	//console.log(data1);
	var com,fav=0,list=0,data1,data2;
	
	comment.find({movieid:id},function(err,com){
	//console.log(com[0].author.username);
	//console.log(com);
		
	rating.find({id:id},function(err,movie_ratings){
		var avg_rating;
		if(movie_ratings.length==0)
			avg_rating="No one has rated this movie!!";
		else
			{
				avg_rating=0.00;
				for(var j=0;j<movie_ratings.length;j++)
					{
							avg_rating+=movie_ratings[j].rating;
					}
				avg_rating=avg_rating/(movie_ratings.length);
			}
	User.findOne({username:y}).populate("watchlist").exec(function(err,user){
		if(err){
			
		}else{
		//console.log(user.watchlist);
		for(var j=0;j<user.watchlist.length;j++)
				{if(user.watchlist[j].id==id)
						{
							data1=user.watchlist[j];
							x=1;
						}
					}}
		
		User.findOne({username:y}).populate("favourate").exec(function(err,user3){
			for(var j=0;j<user3.favourate.length;j++)
				{if(user3.favourate[j].id==id)
						{
							data2=user3.favourate[j];
							z=1;
							console.log(z);
						}
					}
			console.log(user3.favourate.length);
			console.log(z);
		res.render("movie",{data:data,data1:data1,data2:data2,com:com,avg_rating:avg_rating,list:list,fav:fav,x:x,y:z});
			});
		});
	
});
	});
		
	
 }
});
});
app.set('view engine','ejs');
app.get("/",function(req,res){
  res.render("home")
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});
app.get('/about',function(req,res){
	res.render("about.ejs");
		
		});

app.post('/send', (req, res) => {
	const output = `
    You have a new contact request
    Contact Details
    
      Name: ${req.body.name}
      
      Email: ${req.body.email}
      Phone: ${req.body.phone}
    subject: ${req.body.subject}
    Messsage
    ${req.body.message}
  `;
	
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rachitgupta241797@gmail.com',
    pass: 'omtraders24.'
  }
});

var mailOptions = {
  from: 'rachitgupta241797@gmail.com',
  to: 'rachit24gupta@gmail.com, 2018ucp1797@mnit.ac.in,akshitagarwal10505@gmail.com',
  subject: 'Sending Email using Node.js',
  text: output
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
	
res.redirect("/contact")
});
app.get('/email/watchlist',function(req,res){
	res.render("email_watchlist");
});
app.get('/email/favourate',function(req,res){
	res.render("email_favourate");
});
app.post('/send/favourate',function(req,res){
	console.log(req.body.email);
	var y=req.user.username;
	var x=0;
User.findOne({username:y}).populate("favourate").exec(function(err,user){
		if(err){
			
		}else{
			var output=[];
			var name=`This is your favourite list`;
			output.push(name);	
			for(var i=0;i<user.favourate.length;i++)
				{
var name=`
Name:${user.favourate[i].name}
Description:${user.favourate[i].description}`
				output.push(name);
				}
			output=output.join("\n");
			
			var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rachitgupta241797@gmail.com',
    pass: 'omtraders24.'
  }
});

var mailOptions = {
  from: 'rachitgupta241797@gmail.com',
  to: req.body.email,
  subject: 'Sending Email using Node.js',
  text: output
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
			
			
			
			
			
			
			//console.log(output);
		}
});
	req.flash("success","Successfully, mailed your favourite list!!")
	res.redirect("/favourate");
});
app.post('/send/watchlist',function(req,res){
	console.log(req.body.email);
	var y=req.user.username;
	var x=0;
User.findOne({username:y}).populate("watchlist").exec(function(err,user){
		if(err){
			
		}else{
			var output=[];
			var name=`This is your watchlist`;
			output.push(name);	
			for(var i=0;i<user.watchlist.length;i++)
				{
var name=`
Name:${user.watchlist[i].name}
Description:${user.watchlist[i].description}`
				output.push(name);
				}
			output=output.join("\n");
			
			var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rachitgupta241797@gmail.com',
    pass: 'omtraders24.'
  }
});

var mailOptions = {
  from: 'rachitgupta241797@gmail.com',
  to: req.body.email,
  subject: 'Sending Email using Node.js',
  text: output
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
			
			
			
			
			
			
			//console.log(output);
		}
});
	req.flash("success","Successfully, mailed your Watchlist list!!")
	res.redirect("/watchlist");
});

app.use(mostpopularroutes)
app.use(topratedroutes)
app.use(upcomingroutes)
app.use(moviesroutes)
app.use(trendingroutes)
app.use(searchroutes)
//	process.env.PORT
app.listen(process.env.PORT,function(){
  console.log("server has started")
});
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var mysql=require('mysql');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
app.use(express.static(__dirname + '/public'));

app.use(session({
secret: 'vidyapathaisalwaysrunning',
resave: true,
saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

    

require('./passport')(passport);


function DB(){
var connection =mysql.createConnection({
		host:'127.0.0.1',
	 user:'root',
	 password:'kumar1234',
	 database:'user'
});
connection.connect();
return connection;
}
///////////////////////////
app.get("/",function (req,res)
    {   res.render('home.ejs', { message: req.flash('loginMessage'),message1:req.flash('signupMessage') });
         
    });


app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/weather', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


app.post('/login', passport.authenticate('local-login', {
successRedirect : '/weather', // redirect to the secure profile section
failureRedirect : '/', // redirect back to the signup page if there is an error
failureFlash : true // allow flash messages
}));

 app.get("/weather",function(req,res){
       if(req.user)
       res.render('weather.ejs',{usernam:req.user.username});
       else res.render('forbidden.ejs');
 });



urls = "http://fedo.in/blog/feed" // Example RSS Feeds

var feeds=[];
var feedparser=require('ortoo-feedparser');
feedparser.parseUrl(urls).on('article',function(article){
//console.log(article.title);
feeds.push(article);
//console.log(feeds.title);
});
console.log(feeds);
app.get("/rss",function(req,res){

console.log(feeds);
if(req.user)
res.render('rss.ejs',{feedo:feeds,userN:req.user.username});
else res.render('forbidden.ejs');
});
app.get('/logout', function(req, res) {
req.logout();
console.log("hfksjfks",req.user);
res.redirect('/');

});

app.listen(1338);


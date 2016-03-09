var LocalStrategy=require('passport-local').Strategy;
var express = require("express");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var mysql=require('mysql');
var passport = require('passport');
var flash = require('connect-flash');
app.use(flash());
app.use(passport.session());
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

module.exports = function(passport) {
	var ob=new DB();

passport.serializeUser(function(user, done) {
	console.log("***",user);
done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {console.log("####",id);
ob.query("select * from user_info where id = "+id,function(err,rows){  console.log("$$$$",rows);
done(err, rows[0]);
});
});

passport.use('local-login',new LocalStrategy({
// by default, local strategy uses username and password, we will override with email
usernameField : 'email',
passwordField : 'password',
passReqToCallback : true
// passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req,username, password, done) { // callback with email and password from our form
	console.log(username,"  ",password)
ob.query("SELECT * FROM user_info WHERE username = ?",[username], function(err, rows){
	// console.log("Error:",err,"  Result:",rows);
if (err)
return done(err);
if (!rows.length) {
return done(null, false,req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
}
// if the user is found but the password is wrong
console.log(rows);
if (password != rows[0].password)
return done(null, false,req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
// all is well, return successful user
return done(null, rows[0]);
});
}))
passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'spassword',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password,done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            ob.query("SELECT * FROM user_info WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: password  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO user_info ( username, password ) values (?,?)";

                    ob.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );


};
///////////////////////


var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');


module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.getUserById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err){
				console.log('Error' + err);
				return done(err);
			}
			if(!user){
				console.log('Error : user not found')
				return done(null, false, req.flash('error', 'User not found'));
			}
			if(!isValidPassword(user, password)){
				return done(null, false, req.flash('error', 'Invalid password'));
			}
			return done(null, user, req.flash('success', 'You are now logged in'));
		});
	}));
	var isValidPassword = function(user, password){
		return bcrypt.compareSync(password, user.password);
	}
}
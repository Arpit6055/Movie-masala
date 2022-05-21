var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');
const { date } = require('joi');


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
			if(user.lockedUpto && Date.now()<user.lockedUpto){
				console.log('error', 'Account locked');
				return done(null,false, req.flash('error', 'Account locked'))
			}
			
			if(!isValidPassword(user, password)){
				if(user.loginAttempts==3){
					console.log('error', 'Invalid password');
					var tommorow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
					User.updateOne({username}, {loginAttempts:4,lockedUpto:tommorow});
				}else{
					console.log("inc loginttempt");
					User.updateOne({username}, {$inc: { loginAttempts: 1 }});
				}
				return done(null, false, req.flash('error', 'Invalid password'));
			}
			return done(null, user, req.flash('success', 'You are now logged in'));
		});
	}));
	var isValidPassword = function(user, password){
		var a = bcrypt.compareSync(password, user.password);
		if(a && (user.lockedUpto && user.lockedUpto < Date.now() &&  user.loginAttempts==4)){
			User.updateOne({username:user.username}, {lockedUpto:null, loginAttempts:0})
		}
		return a;
	}
}
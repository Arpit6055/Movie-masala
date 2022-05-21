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
		User.getUserByUsername(username,async function(err, user){
			if(err){
				console.log('Error' + err);
				return done(err);
			}
			
			if(!user){
				console.log('Error : user not found')
				return done(null, false, req.flash('errors', {msg:'User not found'}));
			}
			if(user.lockedUpto && Date.now()<user.lockedUpto){
					return done(null,false,req.flash('errors', {msg:'Account locked for 24 hour'}));
			}
			if(!isValidPassword(user, password)){
				if (user.loginAttempts == 3) {
					var tommorow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
					var lockAcc = await User.updateOne({ username }, { loginAttempts: 4, lockedUpto: tommorow });
					return done(null, false, req.flash('errors', {msg:'Account locked for 24 hour'}));
				} else {
					console.log("inc loginttempt");
					var lockAcc = await User.updateOne({ username }, { loginAttempts: user.loginAttempts + 1 });
					return done(null, false, req.flash('errors', {msg:`Invalid password,${4-(user.loginAttempts + 1) } attempts left`}));
				}
			}
			if(user.loginAttempts>=1){
				var unlockAcc = await User.updateOne({username}, {loginAttempts:0, lockedUpto:null})
			}
			return done(null, user, req.flash('success', 'You are now logged in'));
		});
	}));
	var isValidPassword = function(user, password){
		console.log("checking hash");
		return bcrypt.compareSync(password, user.password);
	}
}

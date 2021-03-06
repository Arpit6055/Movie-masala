var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	join_date: {
		type: Date
	},
	loginAttempts: { 
		type: Number, 
		required: true, 
		default: 0 
	},
	lockedUpto: {
		type: Date,
		default: null
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}


module.exports.comparePassword = function(password, hash, callback) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if(err){
			return callback(err);
		}else{
			callback(null, isMatch);
		}
	});
}

module.exports.addUser = function(user, callback){
	User.create(user, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

const router = require("express").Router(),
newUser = require('../controllers/login_register.controller'),
Joi = require("joi"),
{ forwardAuthenticated, ensureAuthenticated } = require("../config/auth"),
validateRequest = require('../config/validate-request');

function registerSchema(req, res, next) {
  const schema = Joi.object({
        username : Joi.string().min(3).max(16).required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(6).max(16).required(),
        name : Joi.string().min(3).required(),
        join_date : Joi.date().default(Date.now())
  });
  validateRequest(req, res, next, schema);
}
function loginSchema(req, res, next) {
  const schema = Joi.object({
        username : Joi.string().min(3).max(16).required(),
        password : Joi.string().min(6).max(16).required()
  });
  validateRequest(req, res, next, schema);
}


// Login Page
router.get('/login/', newUser.getLoginPage);

// Register Page
router.get('/register/', newUser.getRegisterPage);

// Register
router.post('/register/',registerSchema,forwardAuthenticated, newUser.newUserRegistry);

// Login
router.post('/login/',loginSchema,forwardAuthenticated, newUser.login);

// Logout
router.get('/logout/', newUser.logout);

router.get('/dashboard/',ensureAuthenticated, newUser.dashboard);


module.exports = router;

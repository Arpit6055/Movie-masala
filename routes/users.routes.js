
const router = require("express").Router(),
multer = require("multer"),
path = require("path"),
newUser = require('../controllers/login_register.controller'),
Joi = require("joi"),
{ forwardAuthenticated } = require("../config/auth"),
validateRequest = require('../config/validate-request');

function loginSchema(req, res, next) {
  const schema = Joi.object({
        
  });
  validateRequest(req, res, next, schema,0,"register");
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile_pic') ,
  filename:(req, file, cb)=>{
      const uniqueName = `${req.body.email}${path.extname(file.originalname)}`;
     cb(null, uniqueName)
  }
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('profile_pic');

// Login Page
router.get('/getLoginPage/', forwardAuthenticated, newUser.getLoginPage);

// Register Page
router.get('/getRegisterPage/', forwardAuthenticated, newUser.getRegisterPage);

// Register
router.post('/register',forwardAuthenticated,upload, newUser.newUserRegistry);

// Login
router.post('/login', newUser.login);

// Logout
router.get('/logout', newUser.logout);



module.exports = router;

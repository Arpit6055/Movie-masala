const bcrypt = require("bcryptjs"),
  passport = require("passport"),
  User = require('../models/user');
exports.getLoginPage = async (req, res) => {
  try {
    console.log("welcome to login");
    res.status(200).render('login', { title: 'Login', layout : 'layout'});
  } catch (error) {
    req.flash('errors', {msg:'SERVER ERROR'})
    res.redirect("/")
  }
};
exports.getRegisterPage = async (req, res) => {
  try {
    res.status(200).render('register', { title: 'Create Account' ,layout : 'layout'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};
exports.newUserRegistry = async (req, res, next) => {
  try {
    let {username,name,email,password,join_date} = req.body;
    console.log({body:req.body});
    User.findOne({$or: [{
      email
      },
      {
         username
      },
      ]
}).then((user) => {
            console.log({msg : "Inside user"});
            if (user) {
              req.flash('errors', {msg:'Email or username already exist'})
              res.redirect("/auth/register/");
            }else {
                const newUser = new User({name,email,password,username,join_date});
                bcrypt.genSalt(10, (err, salt) => {
                  console.log({msg : "Inside bycrypt"});
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            console.log({user:"Created user successfully"});
                            res.redirect('/auth/login/')
                        }).catch((err) => console.log(err));
                    });
                });
            }
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log({body:req.body});
    passport.authenticate("local-login",{
      successRedirect: "/",
      failureRedirect: '/auth/login/',
      failureFlash: true
    })(req, res, next);
  } catch (error) {
    req.flash('errors', {msg:'SERVER ERROR'})
    res.redirect("/")
  }
};

module.exports = exports;

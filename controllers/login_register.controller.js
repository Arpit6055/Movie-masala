const bcrypt = require("bcryptjs"),
  passport = require("passport"),
  User = require("../models/User");
exports.getLoginPage = async (req, res) => {
  try {
    res.status(200).render('login', { title: 'Login', layout : 'layout'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
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
exports.newUserRegistry = async (req, res) => {
  try {
    const profile_pic = req.file.fieldname;
    const {name,email,password,password2} = req.body;
    let errors = [];
    if (!name || !email || !password || !password2 || !profile_pic) {
        errors.push({msg: "Please enter all fields"});
    }
    if (password != password2) {
        errors.push({msg: "Passwords do not match"});
    }
    if (password.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters"});
    }
    if (errors.length > 0) {
        res.render("register.ejs", {errors,name,email,password,password2});
    } else {User.findOne({email: email}).then((user) => {
            if (user) {
                req.flash("error_msg", "Email already exists");
                res.redirect("/users/register");
            }else {
                const newUser = new User({name,email,password,profile_pic: req.file.filename,});
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            req.flash("success_msg", "You are now registered and can log in");
                            res.redirect("/users/getLoginPage/");
                        }).catch((err) => console.log(err));
                    });
                });
            }
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};
exports.login = async (req, res, next) => {
  try {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};
exports.logout = async (req, res) => {
  try {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};
module.exports = exports;

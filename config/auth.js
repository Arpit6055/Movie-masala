module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("authenticated");
      next();
    }else{
      console.log("not authenticated");
      res.redirect('/auth/login/');
    }
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated() || req.isAuthenticated()  ) {
      next();
    }else{
      res.redirect('/');      
    }
  }
};

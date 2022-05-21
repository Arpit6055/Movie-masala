module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }else{
      console.log("not authenticated");
      res.redirect('/auth/login/');
    }
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      next();
    }else{
      res.redirect('/');      
    }
  }
};

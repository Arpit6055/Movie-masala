const express = require('express'),
connectDB = require('./config/db');
connectDB();
const path = require('path')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, { engine } = require('express-handlebars')
, session  = require('express-session')
, passport = require('passport'),
flash = require('connect-flash');
require('./config/passport')(passport);

var app = express();


app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    secure: true
  })
);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors');
  next();
});

//routes
app.get('/home/', function(req, res) {
  res.status(200).render('login', { title: 'Login', layout : 'layout'});
});
app.use('/',require("./routes/app.routes"));
app.use('/auth/', require("./routes/users.routes"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // console.log(err);
    console.log("error page rendered");
    res.render('error', {
      message: err.message,
      error: typeof err=="object"?JSON.stringify(err):err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));

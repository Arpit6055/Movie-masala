const express = require('express'),
connectDB = require('./config/db');
connectDB();
const path = require('path')
, logger = require('morgan')
, expressValidator = require('express-validator')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, { engine, create } = require('express-handlebars')
, session  = require('express-session')
, passport = require('passport')
, flash = require('connect-flash');
require('./config/passport')(passport);


var app = express();

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());


// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

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

//makes a global variable to access the flash messages within the view template

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
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
    res.render('error', {
      message: err.message,
      error: err
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

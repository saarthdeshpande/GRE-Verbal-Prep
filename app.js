var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const passport = require('passport')
const cookieSession = require('cookie-session')
const session = require('express-session')
require('./src/google-oauth')

const port = process.env.PORT || 3000


var usersRouter = require('./routes/user');
var wordPairRouter = require('./routes/wordPair');
const authRouter = require('./routes/auth')
const paymentRouter = require('./routes/paypal')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(session({secret: 'lmfao', resave: false, saveUninitialized: false}))

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/', wordPairRouter);
app.use('/', usersRouter);
app.use('/auth', authRouter);
app.use('/', paymentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  res.redirect('/login')
});

module.exports = app;

var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const mongoose = require('mongoose'); // mongoose module
const cors = require('cors');


//mongoDB atlas connection to costmanager db
mongoose.connect('mongodb+srv://serverside:project123456@costmanager.dlxfbxf.mongodb.net/costmanager?retryWrites=true&w=majority').then(()=> {
  console.log('Database Connected');
}).catch(err=>{
  console.log('ERROR - Database not Connected')
});



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const reportsRouter = require('./routes/reports'); // show the report
const costsRouter = require('./routes/costs'); // add new



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reports', reportsRouter);
app.use('/costs', costsRouter);

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
});


module.exports = app;

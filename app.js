require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const config = require('./data/config/config.js');

var app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./models/dynamo/article');

AWS.config.update(config.aws_local_config);

var promise = new AWS.DynamoDB.DocumentClient();
promise.then(
  () => {
    console.dir('CONNECTED TO DynamoDB Database');
    var Article = config.model("Article");
    // Check if the Article are empty, insert mock data
    Article.count({}, function(err, c) {
      if(c == 0) {
        console.dir('No Article found in the database. Loading data.');
      } else {
        console.dir( c + ' Article found in the database. Skipping loading data.');
      }
    });
    
  }
).catch(
  err => {
    console.error('ERROR: UNABLE TO CONNECT TO DATABASE');
    console.error('Make sure you have set the environment variable MONGODB_URI to the correct endpoint.');
    console.error(err.message);
  }
);

var articles = require('./routes/articles');
var index = require('./routes/index');

app.use('/', index);
app.use('/api', articles);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var express = require('express');
var AWS = require('aws-sdk');
var awsconfig = require('../data/config/config.js');
AWS.config.update(awsconfig.conf);
var router = express.Router();
var jsonResponse = require('../models/jsonResponse');

/* Default GET for skill share api home */
router.get('/', function(req, res, next) {
  var response = new jsonResponse("Default skill share api endpoint", 200, []);
  res.json(response).status(response.status);
});

/* api health check endpoint */
router.get('/healthz', function(req, res, next) {
  if(awsconfig.docClient != null) {
    res.status(200).send("API health check - OK");
  }
  else {
    res.status(500).send("API health check - FAILURE - dynamo db state ");
  }
});

module.exports = router;

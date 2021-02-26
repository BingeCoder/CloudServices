var express = require('express');
const AWS = require('aws-sdk');
const config = require('./data/config/config.js');
var router = express.Router();
var jsonResponse = require('../models/jsonResponse');

/* Default GET for skill share api */
router.get('/', function(req, res, next) {
  var response = new jsonResponse("Default ratings api endpoint", 200, []);
  res.json(response).status(response.status);
});

/* api health check endpoint */
router.get('/healthz', function(req, res, next) {
  AWS.config.update(config.aws_local_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  if(docClient == 1) {
    res.status(200).send("API health check - OK");
  }
  else {
    res.status(500).send("API health check - FAILURE - dynamo db state ");
  }
});

module.exports = router;

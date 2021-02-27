var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var awsconfig = require("../data/config/config.js");
var AWS = require("aws-sdk");
AWS.config.update(awsconfig.conf);

/* Default GET for skill share api home */
router.get('/', function(req, res, next) {
  var response = new jsonResponse("Default skill share api endpoint", 200, []);
  res.json(response).status(response.status);
});

/* Get all articles */
router.get("/articles", function(req, res, next) {
  const params = {
    TableName: awsconfig.table
  };
  awsconfig.docClient.scan(params, function(err, data) {
      if (err) {
        var response = new jsonResponse("Error: Server error", 500, []);
        res.json(response).status(response.status);
      } else {
        const { Items } = data;
        var response = new jsonResponse("sucess", 200, Items);
        res.json(response).status(response.status);
      }
    });
  });
module.exports = router;


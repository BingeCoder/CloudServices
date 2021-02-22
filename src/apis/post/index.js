var express = require('express');
var dynamo = require('dynamodb');
var router = express.Router();
const config = require('../../../config');

var awsConfig = new Object();
awsConfig.accessKeyId = config.consumer_key;
awsConfig.secretAccessKey = config.consumer_secret;
awsConfig.region = config.region;
dynamo.AWS.config.update(awsConfig);

router.use((req, res, next) => {
    console.log(`Post request received for URL: ${req.url}`);
    next();
});

router.route('/addcategory')
.post((req, res) => {    
    var addCategory = req.body;
    body = await dynamo.put(addCategory).promise();     
    res.status(200).json(body);
});

router.route('/addinterestedskill')
.post((req, res) => {
    var user_name = req.body.user_name;                    
    var params = new Object();
    params.TableName = req.body.table_name; 
    params.Key = new Object();
    params.Key.user_name = user_name;
    params.UpdateExpression = "SET #Y = list_append(#Y,:y)";
    params.ExpressionAttributeNames = {"#Y": "skills_interested"};                    
    params.ExpressionAttributeValues = { ":y":[req.body.skill] }; 
    body = await dynamo.update(params).promise();
    res.status(200).json(body);
});

module.exports = router;
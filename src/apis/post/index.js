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
    body = dynamo.put(addCategory).promise();     
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
    body = dynamo.update(params).promise();
    res.status(200).json(body);
});

router.route('/adduser')
.post((req,res) => {
    var userObject = JSON.parse(JSON.stringify(req.body));
    userObject.TableName = "user_details";
    body = dynamo.put(userObject).promise();
    res.status(200).json(body);
    // Adding to Skills Offered Table Not  Required as per DB discussion
//    var addUserObjectSkillOffered = JSON.parse(JSON.stringify(event.body));
//    addUserObjectSkillOffered.TableName = TABLE_SKILL_OFFERED;
//    addUserObjectSkillOffered.Item = {};
//    addUserObjectSkillOffered.Item.user_name = addUserObject.Item.user_name;
//    addUserObjectSkillOffered.Item.name = addUserObject.Item.first_name + " " + addUserObject.Item.last_name;
//    addUserObjectSkillOffered.Item.skills_offered = [];
//    console.log('skills_offered:', JSON.stringify(addUserObjectSkillOffered));
//    body = await dynamo.put(addUserObjectSkillOffered).promise();
    // Adding to Interested skills not required after db discussion
//    var addUserObjectSkillInterested = JSON.parse(JSON.stringify(event.body));
//    addUserObjectSkillInterested.TableName = TABLE_SKILL_INTERESTED;
//    addUserObjectSkillInterested.Item = {};
//    addUserObjectSkillInterested.Item.user_name = addUserObject.Item.user_name;
//    addUserObjectSkillInterested.Item.name = addUserObject.Item.first_name + " " + addUserObject.Item.last_name;
//    addUserObjectSkillInterested.Item.skills_interested = [];
//    console.log('skills_offered:', JSON.stringify(addUserObjectSkillInterested));
//    await dynamo.put(addUserObjectSkillInterested).promise();
});

router.route('/addofferedskill')
.post((req, res) => {
    var user_name = req.body.user_name;
    var params = new Object();
    params.TableName = req.body.table_name;
    params.Key = new Object();
    params.Key.user_name = user_name;
    params.UpdateExpression = "SET #Y = list_append(#Y,:y)";
    params.ExpressionAttributeNames = {"#Y": "skills_offered"};
    params.ExpressionAttributeValues = { ":y":[req.body.skill] };
    body = dynamo.update(params).promise();
    res.status(200).json(body);
});

module.exports = router;
const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();
const ADD_USER = "add_user";
const ADD_SKILL_OFFERED = "add_skill_offered";
const ADD_SKILL_INTERESTED = "add_skill_interested";
const ADD_CATEGORY = "add_category";
const TABLE_SKILL_OFFERED = "skills_offered";
const TABLE_SKILL_INTERESTED = "skills_interested";
const TABLE_USER_DETAILS = "user_details";
const TABLE_SKILL_CATEGORY = "skills_category";

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    try {
        switch (event.httpMethod) {
            case 'DELETE':
                body = await dynamo.delete(JSON.parse(JSON.stringify(event.body))).promise();
                break;
            case 'GET':
                if(event.resource == "/getskills"){
                if(!event.queryStringParameters.type) {
                    statusCode = 500;
                    body = {error:"Ivalid type query parameter."};
                    break;
                }
                var params = new Object();
                params.TableName = event.queryStringParameters.type;
                if(event.queryStringParameters.user_name) {
                    params.KeyConditionExpression = "#user_name = :name";
                    params.ExpressionAttributeNames = {
                        "#user_name":"user_name"
                    }
                    params.ExpressionAttributeValues = {
                        ":name":event.queryStringParameters.user_name
                    }
                    body = await dynamo.query(params).promise();
                }
                else {
                    body = await dynamo.scan(params).promise();
                }
                }
                else if(event.resource == "/getuser"){
                 if(!event.queryStringParameters.user_name) {
                    statusCode = 500;
                    body = {error:"Ivalid user name."};
                    break;
                }   
                var params = new Object();
                params.TableName = TABLE_USER_DETAILS;
                const user_name = event.queryStringParameters.user_name;
                params.KeyConditionExpression = "#user_name = :name";
                params.ExpressionAttributeNames = {
                    "#user_name":"user_name"
                }
                params.ExpressionAttributeValues = {
                    ":name":event.queryStringParameters.user_name
                }
                body = await dynamo.query(params).promise();
                } else if(event.resource == "/getcategories"){
                var params = new Object();
                params.TableName = TABLE_SKILL_CATEGORY;
                body = await dynamo.scan(params).promise();
                }
                break;
            case 'POST':
                if (event.event_type == ADD_USER) {
                    // Adding to user details table
                    var addUserObject = JSON.parse(JSON.stringify(event.body));
                    addUserObject.TableName = TABLE_USER_DETAILS;
                    body = await dynamo.put(addUserObject).promise();    
                    // Adding to Skills Offered Table
                    var addUserObjectSkillOffered = JSON.parse(JSON.stringify(event.body));
                    addUserObjectSkillOffered.TableName = TABLE_SKILL_OFFERED;
                    addUserObjectSkillOffered.Item = {};
                    addUserObjectSkillOffered.Item.user_name = addUserObject.Item.user_name;
                    addUserObjectSkillOffered.Item.name = addUserObject.Item.first_name + " " + addUserObject.Item.last_name;
                    addUserObjectSkillOffered.Item.skills_offered = [];
                    console.log('skills_offered:', JSON.stringify(addUserObjectSkillOffered));
                    body = await dynamo.put(addUserObjectSkillOffered).promise();    
                    var addUserObjectSkillInterested = JSON.parse(JSON.stringify(event.body));
                    addUserObjectSkillInterested.TableName = TABLE_SKILL_INTERESTED;
                    addUserObjectSkillInterested.Item = {};
                    addUserObjectSkillInterested.Item.user_name = addUserObject.Item.user_name;
                    addUserObjectSkillInterested.Item.name = addUserObject.Item.first_name + " " + addUserObject.Item.last_name;
                    addUserObjectSkillInterested.Item.skills_interested = [];
                    console.log('skills_offered:', JSON.stringify(addUserObjectSkillInterested));
                    await dynamo.put(addUserObjectSkillInterested).promise();    
                }
                else if(event.event_type == ADD_SKILL_OFFERED || event.event_type == ADD_SKILL_INTERESTED) {
                    var user_name = event.user_name;
                    console.log('list append skills_offered:', JSON.stringify(event));
                    var params = {};
                    params.TableName = event.table_name; 
                    params.Key = {};
                    params.Key.user_name = event.user_name;
                    params.UpdateExpression = "SET #Y = list_append(#Y,:y)";
                    if(event.event_type == ADD_SKILL_OFFERED){
                        params.ExpressionAttributeNames = {"#Y": "skills_offered"};    
                    }
                    else if(event.event_type == ADD_SKILL_INTERESTED){
                        params.ExpressionAttributeNames = {"#Y": "skills_interested"};
                    }
                    params.ExpressionAttributeValues = {
                      ":y":[event.skill]  
                    }; 
                    
                    body = await dynamo.update(params).promise();
                }
                else if(event.event_type == ADD_CATEGORY){
                    var addCategory = JSON.parse(JSON.stringify(event.body));
                    body = await dynamo.put(addCategory).promise();    
                }
                
                break;
            case 'PUT':
                body = await dynamo.update(JSON.parse(event.body)).promise();
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
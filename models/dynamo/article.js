var dynamo = require('dynamodb');

var Account = dynamo.define('Article', {
    hashKey : 'category',
    schema : {
      category    : Joi.string()
      }
  });
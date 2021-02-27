var AWS = require("aws-sdk");

AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000" // http://localhost:8000 or https://dynamodb.eu-west-1.amazonaws.com
});


var awsconfig = {
  conf: {
    region: "local",
    endpoint: "http://localhost:8000" // http://localhost:8000 or https://dynamodb.eu-west-1.amazonaws.com
  },
  docClient: new AWS.DynamoDB.DocumentClient(),
  table: "article"
};

// export our configuration
module.exports = awsconfig;
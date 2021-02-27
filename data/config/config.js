var AWS = require("aws-sdk");

AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000"
});


var awsconfig = {
  conf: {
    region: "local",
    endpoint: "http://localhost:8000"
  },
  docClient: new AWS.DynamoDB.DocumentClient(),
  table: "article"
};

// export our configuration
module.exports = awsconfig;

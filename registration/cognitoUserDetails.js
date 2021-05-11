const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
    accessKeyId: config.access_token,
    secretAccessKey: config.access_token_secret,
    region: config.region
});

function getUserDetails() {
    console.log("Get Skills Details...")
    const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-19', region: config.region});
    console.log(config.cognito.userPoolId);

    const poolData = {
        UserPoolId : config.cognito.userPoolId
    }

    return new Promise((resolve,reject) => {
        cognitoIdentityService.listUsers(poolData, (err, data) => {
            if (!err) {
                console.log('Skills Details Success...');
                console.log(JSON.stringify(data));
                resolve(data);
            } else {
                console.log('Skills Details Error...');
                console.log(JSON.stringify(err));
                reject(err);
            }
        });
    });
}

module.exports = getUserDetails;
const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
    region: config.region
});

function deleteUser(username){
    const params1 = {
        UserPoolId: config.cognito.userPoolId,
        Username: username
    };
    console.log("delete user")
    const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-19', region: config.region});

    return new Promise((resolve,reject) => {
        cognitoIdentityService.adminDeleteUser(params1,(err,data)=>{
            if (!err) {
                console.log('delete Success...');
                console.log(JSON.stringify(data));
                resolve(data);
            }
            else {
                console.log('delete Error...');
                console.log(JSON.stringify(err));
                reject(err);
            }
        });
    });
}

module.exports = deleteUser;
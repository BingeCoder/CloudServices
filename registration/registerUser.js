const AWS = require('aws-sdk');
const config = require('../config');
const amazonCognitoIdentity = require('amazon-cognito-identity-js')
const request = require('request');
const https = require('https')
const TAG = 'RegisterUser';

AWS.config.update({
    region: config.region
});

const registerUsingCognito = (fName,lName,gender,phone,emailAddress,password) => {
    console.log("Inside registerUsingCognito");
    const poolData = {
        UserPoolId : config.cognito.userPoolId,
        ClientId : config.cognito.clientId
    }
    const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);
    const firstName = {
        Name: 'given_name',
        Value: fName
    }
    const lastName = {
        Name: 'family_name',
        Value: lName
    }
    const genderAttr = {
        Name: 'gender',
        Value: 'Female'
    }
    const phoneNumber = {
        Name: 'phone_number',
        Value: '+01234567890'
    }
    const emailAttr = {
        Name:"email",
        Value:emailAddress
    }
//    const pictureAttr = {
//        Name:"picture",
//        Value:"/Users/gunjansrivastava/Desktop/EnterpriseProj/EnterpriseProject/drawables/upload.png"
//    }

    const fNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(firstName);
    const lNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(lastName);
    const genderAttribute = new amazonCognitoIdentity.CognitoUserAttribute(genderAttr);
    const phNoAttr = new amazonCognitoIdentity.CognitoUserAttribute(phoneNumber);
    const emailAddAttr = new amazonCognitoIdentity.CognitoUserAttribute(emailAttr);
   // const pictureAttribute = new amazonCognitoIdentity.CognitoUserAttribute(pictureAttr);

    return new Promise((resolutionFunc,rejectionFunc) => {
        userPool.signUp(emailAddress,password,[fNameAttr,lNameAttr,genderAttribute,phNoAttr,emailAddAttr],
            null,(err,data) => {
            if(err){
                console.log(TAG + " Registration failed");
                console.log(err.code);
                console.log(err.message);
                rejectionFunc(err);
            }else{
                console.log("Registration Success: ");
                console.log(data.user);
                const response = {
                    username: data.user.username,
                    userConfirmed: data.userConfirmed,
                    userAgent: data.user.client.userAgent,
                }
                console.log(response);
                resolutionFunc(data);
            }
        });
    });
}

module.exports = registerUsingCognito;





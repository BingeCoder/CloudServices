const AWS = require('aws-sdk');
const config = require('../config');
const amazonCognitoIdentity = require('amazon-cognito-identity-js')
const request = require('request');
const https = require('https')
const TAG = 'RegisterUser';

AWS.config.update({
    region: config.region,
    // accessKeyId: config.awsUser.accessKeyId,
    // secretAccessKey: config.awsUser.secretAccessKey
});

const registerUsingCognito = (fName,lName,gender,phone,birthDate,emailAddress,password) => {
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
    const birthAttr = {
        Name: 'birthdate',
        Value: birthDate
    }
    const emailAttr = {
        Name:"email",
        Value:emailAddress
    }
    const pictureAttr = {
        Name:"picture",
        Value:"/Users/gunjansrivastava/Desktop/EnterpriseProj/EnterpriseProject/drawables/upload.png"
    }

    const fNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(firstName);
    const lNameAttr = new amazonCognitoIdentity.CognitoUserAttribute(lastName);
    const genderAttribute = new amazonCognitoIdentity.CognitoUserAttribute(genderAttr);
    const phNoAttr = new amazonCognitoIdentity.CognitoUserAttribute(phoneNumber);
    const birthdateAttr = new amazonCognitoIdentity.CognitoUserAttribute(birthAttr);
    const emailAddAttr = new amazonCognitoIdentity.CognitoUserAttribute(emailAttr);
    const pictureAttribute = new amazonCognitoIdentity.CognitoUserAttribute(pictureAttr);

    return new Promise((resolutionFunc,rejectionFunc) => {
        userPool.signUp(emailAddress,password,[fNameAttr,lNameAttr,genderAttribute,phNoAttr,birthdateAttr,emailAddAttr,pictureAttribute],
            null,(err,data) => {
            if(err){
                console.log(TAG + " Registration failed");
                console.log(err.code);
                console.log(err.message);
                rejectionFunc(err);
            }else{
                console.log("Registration Success: ");
                console.log(data.user);

                //sendUserDetail(fName,lName,gender,phone,birthDate,emailAddress);

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

function sendUserDetail(fName,lName,gender,phone,birthDate,emailAddress){
    console.log(fName);
    console.log(lName);
    console.log(phone);
    console.log(birthDate);
    console.log(emailAddress);
    const reqBody = JSON.stringify({
        // firstName : fName,
        // lastName : lName,
        // phoneNumber : "+01234567890",
        // birthDate : birthDate,
        name : fName,
        user_name : emailAddress
    });
    const request = require('request');
    const url = "https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/adduser";

    const data = {
        url: url,
        json: true,
        body: reqBody,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    request.post(data, function(error, httpResponse, body){
        console.log("Sent Skills Details To Database");
        console.log(body);
        console.log(httpResponse.toString());
        console.log(error);

    });
}

module.exports = registerUsingCognito;





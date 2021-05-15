const express = require('express');
const formidable = require('formidable');
const registerUsingCognito = require('../../../registration/registerUser');
const verifyUser = require('../../../registration/verifyUser')
const signInUser = require('../../../registration/signInUser')
const getUserDetails = require('../../../registration/cognitoUserDetails')
const uploadFilesToS3 = require('../../../s3_bucket/uploadfileonbucket');
const postTwitter = require('../../../twitter/postTwitter');
const deleteCognitoUser = require('../../../registration/cognitoDeleteUser');
var router = express.Router();
const TAG = "authentication index file"

router.route('/register').
post(function (req, res) {
    console.log("Received register post request" + req.body);
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const pNumber = req.body.phoneNumber;
    const gender = req.body.gender;
    const email = req.body.emailAddress;
    const pwd = req.body.password;
    console.log("Data received inside app.database "+ fName +" " + lName +" "+ email + " " + pwd);
    const response = registerUsingCognito(fName,lName,gender,pNumber,email,pwd);
    response.then((response)=>{
        req.session['currentUser'] = email;
        req.session.cookie.maxAge = 1800000;
        res.send(response);
        console.log("received response in app.database");
    },(error)=>{
        console.log(error.message);
        res.send({status: 404 , error: error});
    }).catch(() => {
        res.send({status: 404});
    });
});

router.route('/verify')
.post(function (req, res) {
    console.log(TAG + " Received verify post request");
    console.log(req.body);
    const code = req.body.verificationCode;
    const email = req.body.email;
    const response = verifyUser(email,code);
    response.then((response)=>{
        res.send({status: 200});
        console.log(TAG + " Verification Success");
        console.log(response.toString());
    },(error)=>{
        console.log(TAG + " Verification Failed");
        console.log(error.code);
        console.log(error.message);
        res.send({status: 404});
    }).catch(() => {
        res.send({status: 404});
    });
});

router.route('/signIn')
.post(function (req, res) {
    console.log(TAG + " Received signIn post request");
    console.log(req.body);
    const email = req.body.email;
    const pwd = req.body.password;
    const response = signInUser(email,pwd);
    response.then((response)=>{
        req.session['currentUser'] = email;
        req.session.cookie.maxAge = 1800000;
        res.send(response);
        console.log(TAG + " SignIn Success");
        console.log(response);
        console.log('gunjan: '+email);
    },(error)=>{
        console.log(TAG + " SignIn Failed");
        console.log(error.statusCode);
        console.log(error.response);
        res.send({status: 404});
    }).catch(() => {
        res.send({status: 404});
    });
});

router.route('/cognito/users')
.get(function (req, res) {
    console.log("Call For Cognito Users");
    const response =  getUserDetails();
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

router.route('/cognito/user')
.delete(function (req, res) {
    console.log("Call to delete Cognito Users");
    const response =  deleteCognitoUser(req.body.username);
    response.then((response)=>{
        res.send(response);
    },(error)=>{
        res.send(error);
    }).catch(() => {
        res.send();
    });
});

router.route('/upload')
.post(function (req, res) {
    // new formidable.IncomingForm().parse(req, (err, fields, files) => {
    console.log("Post Upload Request");
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log("Post Upload Request");
        // console.log(files);
        console.log(fields.username);
        // console.log(fields);
        // console.log(req.session.currentUser);
        if(!files.file){
            res.send({status: 404});
        }
        const response = uploadFilesToS3(files.file,fields.username);
        response.then((response) => {
            res.send(response);
            console.log(TAG + " Upload Success");
            console.log(response);
        }, (error) => {
            console.log(TAG + " Upload Failed");
            console.log(error.statusCode);
            console.log(error.response);
            res.send(error);
        }).catch(() => {
            res.send();
        });
    });
});

router.route('/post')
.post(function (req, res) {
    const promise = postTwitter(req.body);
    promise.then((response)=>{
        res.status(200).send(response);
    },(error)=>{
        res.send(error.body);
    });
});

router.route('/logout')
.post(function (req, res) {
    console.log("logout");
    req.session.destroy();
    res.send({status: 200});
});

module.exports = router;

const express = require('express')
const bodyParser = require('body-parser');
const formidable = require('formidable');

const app = express()
const TAG = 'App.database';
var session = require('express-session')

app.use(express.static('static', {index: 'login.html'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'any string'
}));


const registerUsingCognito = require('./registration/registerUser');
const verifyUser = require('./registration/verifyUser')
const signInUser = require('./registration/signInUser')
const getUserDetails = require('./registration/cognitoUserDetails')
const uploadFilesToS3 = require('./s3_bucket/uploadfileonbucket');
const postTwitter = require('./twitter/postTwitter');
const deleteCognitoUser = require('./registration/cognitoDeleteUser');

app.post('/register', function (req, res) {
    console.log("Received register post request" + req.body);
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const pNumber = req.body.phoneNumber;
    const gender = req.body.gender;
    const birthdate = req.body.birthDate;
    const email = req.body.emailAddress;
    const pwd = req.body.password;
    console.log("Data received inside app.database "+ fName +" " + lName +" "+ email + " " + pwd);
    const response = registerUsingCognito(fName,lName,gender,pNumber,birthdate,email,pwd);
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

app.post('/verify', function (req, res) {
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

app.post('/signIn', function (req, res) {
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

app.get('/cognito/users', function (req, res) {
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

app.delete('/cognito/user', function (req, res) {
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


app.post('/upload', function (req, res) {
    // new formidable.IncomingForm().parse(req, (err, fields, files) => {
    console.log("Post Upload Request");
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log("Post Upload Request");
        // console.log(files);
        console.log(fields.username);
        // console.log(fields);
        // console.log(req.session.currentUser);
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

app.post('/post', function (req, res) {
    const promise = postTwitter(req.body);
    promise.then((response)=>{
        res.status(200).send(response);
    },(error)=>{
        res.send(error.body);
    });
});

app.post('/logout', function (req, res) {
    console.log("logout");
    req.session.destroy();
    res.send({status: 200});
});

const server = app.listen(3000);

module.exports = server;

var express = require('express');
var postApis = require('./apis/post');
var authenticate = require('./apis/authentication');
const bodyParser = require('body-parser');
var session = require('express-session')

const PORT = 8888; 

async function startServer(){

    const app = express();    
    app.use(express.static('static', {index: 'login.html'}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'any string'
    }));
        
    app.use('/add', postApis);
    app.use('/authenticate',authenticate);

    app.listen(PORT, (err) => {
        if(err){
            console.log(`Error in starting server at ${PORT}`);
        }
        else {
            console.log(`Successfully started the server at port ${PORT}`);
        }
        
        console.log(`
        ########################################
            Server listening at port ${port}
        ########################################
        `);
    });
};

startServer();
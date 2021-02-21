var express = require('express');
var postApis = require('./apis/post');

const PORT = 8888; 

async function startServer(){

    const app = express();    
        
    app.use('/add', postApis);

    app.listen(PORT, (err) => {
        if(err){
            console.log(`Error in starting server at ${PORT}`);
        }
        else {

        }
        
        console.log(`
        ########################################
            Server listening at port ${port}
        ########################################
        `);
    });
};

startServer();
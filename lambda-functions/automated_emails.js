var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });
var docClient = new aws.DynamoDB.DocumentClient();
var params = {
                TableName : "skills_interested",
                ProjectionExpression:"#user, #skills",
                
                ExpressionAttributeNames:{
                    "#user": "user_name",
                    "#skills" : "skills_interested"
                },
               
};

var returnValue = [];
async function getEmailinfo() {
    
    var count = 0;
    var skills = [];
    var username = [];
    var extractedTime = ""
    var extratedUsers = [];
    
    
     //**********Code to fetch the current time*********//
    
    let date_ob = new Date();
    
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
    
    // current hours
    let hours = date_ob.getHours() - 7;
    
    // current minutes
    let minutes = date_ob.getMinutes();
    
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let timeRightNow = year + "-" + month + "-" + date;
    
    //**********End of code to fetch the current time*********//   
    
    
        try {
            
                console.log("Scanning Users table.");
                var data = await docClient.scan(params).promise();
                console.log("Scan done");
                console.log(data.Items);
                
                for (var i = 0; i < data.Items.length; i++){
                
                // console.log("=========================");
                
                 for(var j=0; j< (data.Items[i].skills_interested.length) ; j++){
                         //console.log(data.Items[i].skills_interested[j].time);
                         var timeOfTheClass = "" + data.Items[i].skills_interested[j].time;
                            // console.log(timeOfTheClass);
                     }  
                     
                      for(var x = 0; x < timeOfTheClass.length; x++){
                        
                         if(timeOfTheClass.charAt(x) == "T" ){ break; }
                        
                              extractedTime += timeOfTheClass.charAt(x) ;
                         
                      }
                      
                       if(timeRightNow.toString() == extractedTime.toString()){
                          
                           extratedUsers.push((data.Items[i].user_name));
                           
                        //   console.log("YES ITS TRUE");
                       }
                     console.log("This is the extracted time: ", extractedTime);
                     console.log("This is date today: ", timeRightNow)
                     console.log(data.Items[i].user_name); 
               timeOfTheClass = "";
                extractedTime = "";
            }
                console.log("These are the extracted users: " + extratedUsers);
                
                return extratedUsers;
            }
            catch (error) {
                console.log("Exception occurred while running scan");
                return error;
            }
    }

    
exports.handler = async function (event) {
    var res = true;
    var stCode = 200;
    var bodyStr = "Success"; 

//*****Code to fetch emailIds of the users from Dynamodb whose classes have upcoming time in the next one hour of the current time******//   

   
    console.log("BEGIN HERE");
    var results = [];
    var results = await getEmailinfo();
    
    
     
    var emailIds = results;
    var constructMsg = "Hey there! \nThis is a message from SkillShare. \nDon't forget, you have a class today!";
    
    console.log("THIS IS THE FINAL RESULTS: " + emailIds);
   
    
//**********End of code to fetch emailIds*********//   
    
  var params = {
    Destination: {
      ToAddresses: emailIds,
    },
    Message: {
      Body: {
        Text: { Data: constructMsg },
      },

      Subject: { Data: "Reminder from SkillShare!" },
    },
    Source: "anupama.kurudi@sjsu.edu",
  };
 
  return ses.sendEmail(params).promise();
};


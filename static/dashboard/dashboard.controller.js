//Global Variables
var user_name = "daniel@gmail.com";
const fileInput = $('#imgInput');
const profileImg = $('#profileImg');

fileInput.change(addProfilePicInS3)

function getActivityCreated() {
  fetch("https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/getskills?type=skills_offered&user_name="+ user_name)
    .then((response) => response.json())
    .then((data) => {
      //console.log(JSON.stringify(data));
      //console.log(data);
      for (var i = 0; i < data.Items[0].skills_offered.length; i++) {
        let item = data.Items[0].skills_offered[i];
        
        var category = item.category;
        var activity_name = item.activity_name;
        var time = item.time;
        var desc = item.desc;
        var capacity = item.capacity;

        // var skillConstructed = {
        //   "category": category,
        //   "activity_name": activity_name,
        //   "desc": desc,
        //   "time": time,
        //   "capacity": capacity
        // }
        
        var userHTML = `<div class="col-sm-4 mb-3">
                              <div class="card h-100">
                                <div class="card-body">
                                <h5 class="d-flex align-items-center mb-3"><i class="material-icons text-info mr-2">Activity Summary: </i></h5>
                                  <h6 class="capitalize">Category: <span>` + category + `</span> </h6> 
                                  <h6 class="capitalize">Activity: <span>` + activity_name + `</span> </h6> 
                                  <h6>Description: <span>` + desc + `</span> </h6>
                                  <h6>Time: <span>` + time + `</span> </h6> 
                                  <h6 class="capitalize">Capacity: <span>` + capacity + `</span> </h6> 
                                  <button class="btn btn-info" id="deleteActivity" href=#><img src="../../svg/trash.png" alt="Delete" width="20px" height="18px">Delete</button>
                                </div>
                              </div>
                            </div>`;
                            //The button that was disabled here cuz the person who created it cannot join his own activity
                          //<button type="button" 
                          //onclick = "addInterestedSkill('${user_name}', '${category}','${activity_name}','${time}','${desc}','${capacity}')" 
                          //class="btn btn-info">Join Activity</button>
        $("#activityCardOffered").append(userHTML)
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
getActivityCreated(); // Call this function with the current user_name as parameter

//---------------------Function to call the Activities the User signed up for-----------------//

function getActivitySignedUpFor() {
  fetch("https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/getskills?type=skills_interested&user_name=" + user_name)
    .then((response) => response.json())
    .then((data) => {
      //console.log(JSON.stringify(data));
      //console.log(data);
      for (var i = 0; i < data.Items[0].skills_interested.length; i++) {
        let item = data.Items[0].skills_interested[i];
        //console.log("Item: " + JSON.stringify(item));
        var category = item.category;
        var activity_name = item.activity_name;
        var time = item.time;
        var desc = item.desc;
        var capacity = item.capacity;
        var name = data.Items[0].name;
        
        var userHTML = `<div class="col-sm-4 mb-3">
                              <div class="card h-100">
                                <div class="card-body">
                                <h5 class="d-flex align-items-center mb-3"><i class="material-icons text-info mr-2">Activity Summary: </i></h5>
                                  <h6 class="capitalize">Category: <span>` + category + `</span> </h6> 
                                  <h6 class="capitalize">Activity: <span>` + activity_name + `</span> </h6> 
                                  <h6>Description: <span>` + desc + `</span> </h6>
                                  <h6>Time: <span>` + time + `</span> </h6> 
                                  <h6 class="capitalize">Capacity: <span>` + capacity + `</span> </h6> 
                                  <h6 class="capitalize">Offered by: <span>` + name + `</span> </h6> 
                                </div>
                              </div>
                            </div>`;

        $("#activityCardInterested").append(userHTML)
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
getActivitySignedUpFor();

//Pop-up Form Submission with all the DATA captured

function PostFormOnSubmit(theForm) {
  var category = theForm.validationDefault01.value;
  var activity_name = theForm.validationDefault02.value;
  var desc = theForm.validationDesc.value;
  var time = theForm.validationDefault03.value;
  var capacity = theForm.validationDefault05.value;

  var skill = {
    "category": category,
    "activity_name": activity_name,
    "desc": desc,
    "time": time,
    "capacity": capacity
  }
  //console.log(category, activity_name, desc, time, capacity);
  //console.log("HEEEYYY");
  //hard-coding username ----change here
  //Add the skill you just captured from the filled form
  addOfferedSkill(user_name, skill);
  //also call the display activities to show the latest list of "signed-up for"
  getActivitySignedUpFor();
}

//The Find Activity based on Category Page form submission

function FetchActivitiesOnSubmit(theCategory) {
  var category = theCategory.categoryValue.value;
  try {

    console.log(category);

    fetch('https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/getskills?type=skills_offered', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    }).then(data =>
      data.json().then(response => {
        if (data.status === 200) {
          console.log("Skills Fetched Successfully");
          console.log(response);
          getActivityBasedOnCategory(response.Items, category, user_name);
        } else {
          console.log("Could not fetch the Activities based on Category");
        }
      }));

  } catch (error) {
    console.log("Could not call the function to add the interested skill! Error:\n" + error);
    return null;

  }
}

async function postData(data, url) {
  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      //redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log("Request complete! POST SUCCESS! response:", JSON.stringify(response));
    return response.json();
  } catch (error) {
    //console.log("POST Error! Could not add the interested skill! Error:\n" + error);
    return null;
  }
}

async function addInterestedSkill(username, category, activity_name, time, desc, capacity) {
  //console.log(username, category, activity_name, time, desc, capacity);
  let data = {
    "user_name": username,
    "skill": {
      "category" : category,
      "activity_name" : activity_name,
      "time" : time,
      "desc" : desc,
      "capacity" : capacity
    }
  };
  /*console.log("Data: " + JSON.stringify(data)); */
  let url = "https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/addinterestedskill";

  var postResponse = await postData(data, url);

  return postResponse;
}


// //----------- OFFERED ACTIVITY ----------------

async function addOfferedSkill(username, skill) {
  let data = {
    "user_name": username,
    "skill": skill
  };
  /*console.log("Data: " + JSON.stringify(data)); */
  let url = "https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/addofferedskill";

  var postResponse = await postData(data, url);

  return postResponse;
}

// var usernameExample = "abc";

// var skillExample = {
//    "category" : "indoor games",
//    "activity_name" : "carrom",
//    "desc": "Its a two person game.",
//    "time" : "6 pm",
//    "capacity": "2"
//};
// addOfferedSkill(usernameExample, skillExample);

// skillExample = {
//    "category" : "language",
//    "activity_name" : "german",
//    "desc": "Its a two person game.",
//    "time" : "6 pm",
//    "capacity": "2"
// };

function findActivityBasedOnCategory() {
  // const $skillsTable = $('#skillsTable'); // the dropwdown's selector

  // const $findSkillBtn = $('#findSkill');
  // $skillsTable.hide();


  
}

function getActivityBasedOnCategory(OfferedList, selectedCategory, userName) {
  $("#actOffered").empty()
  for (let i = 0; i < OfferedList.length; i++) {
      var activity = OfferedList[i];
      //console.log("This is the Activity:", activity);
      var email = activity.user_name;
      
      if (email !== userName) {
        //console.log(email);
        //console.log(activity.skills_offered);
        for(let j=0 ; j < activity.skills_offered.length; j ++ ){
            var skillOffered = activity.skills_offered[j];
            
            if(skillOffered.category.toLowerCase() == selectedCategory.toLowerCase()){
              //console.log("This is the current category: " + skillOffered.category);
              //console.log("Selected category: " + selectedCategory);
              var name = activity.name;
              var activity_name = skillOffered.activity_name;
              var desc = skillOffered.desc;
              var user_name = activity.user_name;
              var category = skillOffered.category;
              var capacity = skillOffered.capacity;
              var time = skillOffered.time;

              var userHTML = `<div class="card-style">
                              <div class="card h-100">
                                <div class="card-body">
                                <h5 class="d-flex align-items-center mb-3"><i class="material-icons text-info mr-2">Activity Summary: </i></h5>
                                  <h6 class="capitalize">Category: <span>` + category + `</span> </h6> 
                                  <h6 class="capitalize">Activity: <span>` + activity_name + `</span> </h6> 
                                  <h6>Description: <span>` + desc + `</span> </h6>
                                  <h6>Time: <span>` + time + `</span> </h6> 
                                  <h6 class="capitalize">Capacity: <span>` + capacity + `</span> </h6> 
                                  <h6 class="capitalize">Offered By: <span>` + name + `</span> </h6> 
                                  <button type="button" 
                                  onclick = "addInterestedSkill('${email}', '${category}','${activity_name}','${time}','${desc}','${capacity}')" 
                                  class="btn btn-info">Join Activity</button>
                                </div>
                              </div>
                            </div>`;

        $("#actOffered").append(userHTML)

        }
        

        } 
      }
  }

}

function addProfilePicInS3(){
  let file = this.files[0];
  profileImg[0].src = URL.createObjectURL(this.files[0]);
  let formData = new FormData();
  formData.append('file', file);
  formData.append('username','gunjan');

  fetch('/upload' , {
    method : 'post',
    body : formData
  }).then(response =>
      response.json().then(data => ({
            files: data,
            status: response.status
          })
      ).then(response => {
        if(response.status === 200){
          console.log(" Upload Success");
          console.log(response.files);
          //insertIntoDb(response.files.Bucket,response.files.Key);
        }
        else{
          console.log("Upload Failed");
        }
      }));
}


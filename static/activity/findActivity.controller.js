import Skills from "../models/Skills.js"
function findActivity() {
    const $skillsTable = $('#skillsTable');
    //const $categoryDropdown = $('#categoryDropdown');
    const $tweetBtn = $('#tweetBtn');
    $skillsTable.hide();
    $tweetBtn.click(getCognitoUserDetails());

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
                getSkills(response.Items, "Sports" , "David@gmail.com");
            } else {
                console.log("Skills Fetched Failed");
            }
        }));
    }

    function getCognitoUserDetails(){
        fetch('/cognito/users' ,{
            method : 'get',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => ({
                    files: data,
                    status: response.status
                })
            ).then(response => {
                if(response.status === 200){
                    console.log("Cognito User Fetch Success");
                    console.log(response.files);
                    //loadAdminTable(response.files);
                }
                else{
                    console.log("Cognito User Fetch Failed");
                }
            }));
    }

    function getSkills(usersList , selectedCategory, userName){
        const myList = new Array();
        for(let i=0; i< usersList.length ; i++){
            const user = usersList[i];
            const name = user.name;
            const email = user.user_name;
            if(email !== userName) {
                const skills = user.skills_offered;
                for (let j = 0; j < skills.length; j++) {
                    const skill = skills[j];
                    const category = skill.category;
                    if (selectedCategory === category) {
                        const newSkill = new Skills(name, email, skill.activity_name, skill.time, skill.desc, skill.capacity);
                        myList.push(newSkill);
                    }
                }
            }
        }
        return myList;
    }

    function postTweet(){
        const message = "Enterprise Tweet";
        fetch('/post' , {
            method : 'post',
            body : JSON.stringify({status:message}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(function(response){
            if(response.status == 200){
               console.log('Post Tweeted Successfully');
            }
            else{
                console.log('Error occurred:'+response.statusText);
            }
        });
    }
findActivity();

import Skills from "./models/Skills.js"
function findActivity() {

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
                getSkills(response.Items, "sports");
            } else {
                console.log("Skills Fetched Failed");
            }
        }));
}

    function getSkills(usersList , selectedCategory){
        const myList = new Array();
        for(let i=0; i< usersList.length ; i++){
            const user = usersList[i];
            const name = user.name;
            const email = user.user_name;
            const skills = user.skills_offered;
            for(let j=0;j<skills.length;j++){
                const skill = skills[j];
                const category = skill.category;
                if(selectedCategory === category){
                    const newSkill = new Skills(name,email,skill.activity_name,skill.time,skill.desc,skill.capacity);
                    myList.push(newSkill);
                }
            }
        }
        return myList;
    }
findActivity();
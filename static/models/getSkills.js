import Skills from "./Skills";

function fetchSkillList(usersList , selectedCategory){
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
export {fetchSkillList};
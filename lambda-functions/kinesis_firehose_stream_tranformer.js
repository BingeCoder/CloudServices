exports.handler = async (event, context) => {
    /* Process the list of records and transform them */
    const output = event.records.map((record) => {
        /* This transformation is the "identity" transformation, the data is left intact */
        
        console.log(`Record::: ${record.data}`);
        let buff = new Buffer(record.data, 'base64');
        let text = buff.toString('ascii');
        console.log(`Record data base 64 decoded::: ${text}`);
        let rows = JSON.parse(text);
        var skillArray = [];
        if(rows.dynamodb && rows.dynamodb.NewImage) {
        const skills = rows.dynamodb.NewImage.interests.L;
        console.log(`List of interests::: ${skills}`);
        skills.forEach((element) => {
            var obj = new Object();
            obj.skill = element.S;
            skillArray.push(obj);    
        });
        } else {
            var obj = new Object();
            obj.skill = "";
            skillArray.push(obj);
        }
        let buffSkillsArray = new Buffer(JSON.stringify(skillArray));
        let base64Obj = buffSkillsArray.toString('base64');
        console.log(`Skill array object to return::: ${JSON.stringify(buffSkillsArray)}`);
        return {
        recordId: record.recordId,
        result: 'Ok',
        data: base64Obj,
        }
    });
    console.log(`Processing completed.  Successful records ${JSON.stringify(output)}.`);
    return { records: output };
};

(function(){
    const $deleteBtn = $('#deleteBtn');
    const $inputCatgry = $('#inputCatgry');
    const $categoryBtn = $('#btnCategory');

    $categoryBtn.click(addCategory);

    function logout() {
        fetch('authenticate/logout', {
            method: 'post',
            body: '',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>
            response.json().then(data => {
                window.location = "login.html";
                //window.location = "http://localhost:3000/login.html";
            }));
    }

    function onLoad(){
        const TAG = "Fetch User Details..."
        console.log("Started...")

        fetch('authenticate/cognito/users' ,{
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
                    loadAdminTable(response.files);
                }
                else{
                    console.log("Cognito User Fetch Failed");
                }
            }));
    }

    function loadAdminTable(files){
        console.log("Loading Admin Table...");
        const table = $('#adminTable');
        const tblBody = document.createElement("tbody");

        for(let i=0; i<files.Users.length; i++){
            const user = files.Users[i];

            const firstName = user.Attributes[5].Value;
            const lastName = user.Attributes[6].Value;
            const emailAddress = user.Attributes[7].Value;
            const userCreateDate = user.UserCreateDate;
            const username =  user.Username;
            let data = [firstName,lastName,emailAddress,userCreateDate];

            const row = document.createElement("tr");

            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('td');
                if(j === 4){
                    var btn = document.createElement('button');
                    btn.className = "btn btn-danger";
                    // var linkText = document.createTextNode("View");
                    // a.appendChild(linkText);
                    btn.innerHTML = "Delete";
                    btn.onclick = function(){
                        deleteUser(username)
                        console.log("delete called");
                        console.log(this);
                    };
                    cell.appendChild(btn);
                    row.appendChild(cell);
                }else {
                    const val = document.createTextNode(data[j]);
                    cell.appendChild(val);
                    row.appendChild(cell);
                }
            }
            function deleteUser(username){
                fetch('authenticate/cognito/user' ,{
                    method : 'delete',
                    body : JSON.stringify({username: username}),
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
                            console.log(response);
                            //onLoad();
                            location.reload();
                        }
                        else{
                            console.log("Cognito User Fetch Failed");
                        }
                    }));
            }

            tblBody.appendChild(row);
        }
        table.append(tblBody);

        // const tble = document.getElementById('adminTable');
        // for (let i = 0; i < tble.rows.length; i++) {
        //         tble.rows[i].onclick = function () {
        //             tableClick(this);
        //         };
        // }
        // function tableClick(row) {
        //     console.log(row);
        //     const email = row.getElementsByTagName('td')[2].innerHTML;
        //     const user = row.getElementsByTagName('td')[0].innerHTML;
        //     window.localStorage.setItem('selectedEmail', email);
        //     window.localStorage.setItem('selectedUser' , user);
        //     window.location = "http://localhost:3000/adminUserFileDetails.html";
        // }
        console.log("Table Updated...");
        showCategory();
    }

    function showCategory(){
        fetch('https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/getcategories', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if (data.status === 200) {
                    console.log("category Fetched Successfully");
                    console.log(response);
                    console.log(response.Items);

                    const items =  response.Items;
                    const table = $('#categoryTable');
                    const tblBody = document.createElement("tbody");
                    for(let i=0; i<items.length; i++){
                        const cell = document.createElement('td');
                        const category = items[i].category;
                        const row = document.createElement("tr");
                        const val = document.createTextNode(category);
                        cell.appendChild(val);
                        row.appendChild(cell);
                        const cell2 = document.createElement('td');
                        var btn = document.createElement('button');
                        btn.className = "btn btn-danger";
                        // var linkText = document.createTextNode("View");
                        // a.appendChild(linkText);
                        btn.innerHTML = "Delete";
                        btn.onclick = function(){
                            deleteCategory(category)
                            console.log("delete called");
                            console.log(this);
                        };
                        cell2.appendChild(btn);
                        row.appendChild(cell2);

                        tblBody.appendChild(row);
                    }
                    table.append(tblBody);
                    function deleteCategory(category){
                        fetch('https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/deletecategory' ,{
                            method : 'post',
                            body : JSON.stringify({category: category}),
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
                                    console.log(response);
                                    //onLoad();
                                    location.reload();
                                }
                                else{
                                    console.log("Cognito User Fetch Failed");
                                }
                            }));
                    }
                } else {
                    console.log("Could not fetch the Category");
                }
            }));
    }

    function addCategory(){
        const category = $inputCatgry.val();
        fetch('https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/addcategory', {
            method: 'POST',
            body: JSON.stringify({"category":category}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if (data.status === 200) {
                    console.log("category add Successfully");
                    console.log(response);
                    //showCategory();
                    location.reload();
                } else {
                    console.log("Could not fetch the Category");
                }
            }));
    }
    onLoad();
})();
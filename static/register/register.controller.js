(function(){
    const emailAddressFld = $('#emailAddressFld');
    const passwordFld = $('#passwordFld');
    const firstNameFld = $('#firstNameFld');
    const lastNameFld = $('#lastNameFld');
    const phoneNumberFld = $('#phoneNumberFld');
    const birthDateFld = $('#birthDateFld');
    const enterCodeFld = $('#enterCodeFld');
    const submitCodeBtn = $('#submitCodeBtn');
    const registerBtn = $('#registerBtn');
    const signUpBtn = $('#signUpBtn');
    const registrationUnaccessAlert = $('#register-unsuccess');
    const verifyPasswordFld = $('#verifyPasswordFld');
    const successAlert = $('#register-success');
    const verifyUnsuccessAlert = $('#verify-unsuccess');
    const registerContainer = $('#register-div');
    const verifyContainer = $('#verify-div');
    let userName;

    registerBtn.click(register);
    submitCodeBtn.click(verifyCode);
    signUpBtn.click(register);
    const TAG = 'HandleRegister';

    function register(){
        console.log(TAG + "Executing Register...")
        const interestedSkillList = new Array();
        var skills = document.getElementsByName('skills');
        for (var checkbox of skills) {
            if (checkbox.checked) {
                interestedSkillList.push(checkbox.value);
                console.log(checkbox.value);
            }
        }
        const firstName = firstNameFld.val();
        const lastName = lastNameFld.val();
        const emailAddress = emailAddressFld.val();
        const phoneNumber = phoneNumberFld.val();
        const birthDate = birthDateFld.val();
        const password = passwordFld.val();
        const verifyPassword = verifyPasswordFld.val();

        registrationUnaccessAlert.hide();
        if(password!=verifyPassword){
            registrationUnaccessAlert.html('Registration unsuccessful. Entered passwords does not match');
            registrationUnaccessAlert.show();
            return;
        }

        fetch('/register' , {
            method : 'post',
            body : JSON.stringify({firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, birthDate: birthDate, gender: "25",
                emailAddress : emailAddress, password : password}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if(response.status===404) {
                    //registrationUnaccessAlert.html('Registration unsuccessful. Something went wrong.');
                    registrationUnaccessAlert.html(response.error.message);
                    registrationUnaccessAlert.show();
                    console.log(TAG + "Registration Failed");
                    return;
                }
                console.log(TAG + "Registration Success");

                userName = response.user.username;
                window.localStorage.setItem('firstName', firstName);
                window.localStorage.setItem('lastName', lastName);
                window.localStorage.setItem('email', emailAddress);
                window.localStorage.setItem('phone', phoneNumber);
                window.localStorage.setItem('birthdate', birthDate);
                window.localStorage.setItem('interestedSkills', JSON.stringify(interestedSkillList));
                const skills = window.localStorage.getItem('interestedSkills');
                console.log(skills);
                successAlert.html("Verification Code has been sent to your registered email address. Please enter to proceed.")
                successAlert.show();
                registerContainer.hide();
                verifyContainer.show();
            }));
    }
    function verifyCode(){
        console.log(TAG + "Executing Verify...");
        successAlert.hide();
        verifyUnsuccessAlert.hide();
        const code = enterCodeFld.val();
        fetch('/verify' , {
            method : 'post',
            body : JSON.stringify({verificationCode: code , email: userName}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if(response.status === 200){
                    console.log(TAG + " Verification Success");
                    console.log(response);
                    addUserInDB();
                }
                else{
                    console.log(TAG + "Verification Failed");
                    verifyUnsuccessAlert.html("Incorrect verification code provided.")
                    verifyUnsuccessAlert.show();
                }
            }));
    }

    function addUserInDB() {
        const fName = window.localStorage.getItem('firstName');
        const lName = window.localStorage.getItem('lastName');
        const email = window.localStorage.getItem('email');
        const phone = window.localStorage.getItem('phone');
        const birthDate = window.localStorage.getItem('birthdate');
        const skills = window.localStorage.getItem('interestedSkills');
        console.log(skills);
        fetch('https://eddbusbki1.execute-api.us-west-2.amazonaws.com/dev/adduser', {
            method: 'post',
            body: JSON.stringify({
                first_name: fName,
                last_name: lName,
                birth_Date: birthDate,
                user_name:email,
                phone:phone,
                picture:"/Users/gunjansrivastava/Desktop/EnterpriseProj/EnterpriseProject/drawables.upload.png",
                interests: skills
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                console.log("DB Insert Success");
                console.log(response);
                //window.location = "home.html";
                window.location = "http://localhost:3000/dashboard.html"
            } else {
                console.log(TAG + "DB Insert Failed");
            }
        });
    }

    function addProfilePicInS3(){
        let file = this.files[0];
        let formData = new FormData();
        formData.append('file', file);

        fetch('/upload' , {
            method : 'post',
            body : formData,
            headers: {
                'content-type': 'application/json'
            }
        }).then(data =>
            data.json().then(response => {
                if(response.status === 200){
                    console.log(TAG + " Upload Success");
                    console.log(response);
                    window.location = "http://localhost:3000/home.html";
                }
                else{
                    console.log(TAG + "Upload Failed");
                }
            }));
    }

    function signIn(){
        //window.location = "signIn.html";
        window.location = "http://localhost:3000/signIn.html";
    }

    function validateEmail(mail)
    {
        if (/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/.test(myForm.emailAddr.value))
        {
            return true
        }
        alert("You have entered an invalid email address!")
        return false
    }
})();

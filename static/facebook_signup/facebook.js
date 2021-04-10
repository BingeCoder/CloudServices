(function(){
    console.log('---fb signup begin');
    const fbSignUpBtn = $('#fbSignUp');
    fbSignUpBtn.click(fbSignUp);
    function fbSignUp(){
        console.log('---fb signup clicked');
        FB.login(facebookAuthResponseHandler, {scope: "public_profile,email"});
    };       
    
  function facebookAuthResponseHandler(response){
    if (response.authResponse) {
            
        console.log(JSON.stringify(response));
        FB.api('/me',{fields: 'first_name, last_name , email, birthday, picture'} ,facebookProfileInformation);
    
      console.log('You are now logged in.');                                                    
    
    } else {
      console.log('There was a problem logging you in.');
    }
  };

  function facebookProfileInformation(response){    
    console.log(`Faceboos response saved to local storage:::${JSON.stringify(response)}`);
    window.location.href = `../register.html?facebook=${JSON.stringify(response)}`;
  };
 })();
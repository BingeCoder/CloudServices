(function(){
    console.log('---fb signup1');
    const fbSignUpBtn = $('#fbSignUp');
    fbSignUpBtn.click(fbSignUp);
    function fbSignUp(){
        console.log('---fb signup');
        FB.login(facebookAuthResponseHandler, {scope: "public_profile,email"});
        };       
    
  function facebookAuthResponseHandler(response){
    if (response.authResponse) {
            
        console.log(JSON.stringify(response));
        FB.api('/me',{fields: 'first_name, last_name , email, picture'} ,facebookProfileInformation);
    
      console.log('You are now logged in.');                                                    
    
    } else {
      console.log('There was a problem logging you in.');
    }
  };

  function facebookProfileInformation(response){
      //TODO: Use this data for registration.
    console.log(JSON.stringify(response));
  };
 })();
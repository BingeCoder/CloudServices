(function(){
    const fileInput = $('#imgInput');
    const profileImg = $('#profileImg');

    fileInput.change(addProfilePicInS3)
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
})();
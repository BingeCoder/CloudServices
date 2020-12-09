const AWS = require('aws-sdk');
const config = require('../config');
const TAG = 'UploadFileOnBucket';
AWS.config.update({
    region: config.region,
});

const s3 = new AWS.S3({apiVersion: config.s3.apiVersion});

const retrieveFilesFromS3= (username) => {
    console.log(TAG + " Get Files...");
    const params = {
        Bucket: config.s3.bucketName,
        Key: `gunjan`
    };
    return new Promise((resolutionFunc, rejectionFunc) => {
        s3.getObject(params, function (err, data) {
            if (err) {
                console.log( " Retrieve Error");
                console.log(err);
                rejectionFunc(err);
            } if (data) {
                console.log(" Retrieve Success");
                console.log(data);
                resolutionFunc(data);
            }
        });
    });
}

module.exports = retrieveFilesFromS3;


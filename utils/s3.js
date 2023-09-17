const aws = require('aws-sdk');
const crypto = require('crypto');

const region = `us-east-2`;
const bucketName = `portfolio-ejw`;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region, accessKeyId, secretAccessKey,
    signatureVersion: 'v4'
});

//NOTE: Maybe...
// const s3 = new aws.S3({
//     credentials: {
//         accessKeyId, secretAccessKey
//     },
//     region
// })

async function uploadURL(req,file) {

    const fileObj = req.files[`${file}`][0];

    const fileName = await crypto.randomBytes(32).toString('hex');

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 15 // link is available for 15 seconds.
    }

    // return await s3.getSignedUrlPromise('putObject', params);
    req.s3 = await s3.getSignedUrlPromise('putObject', params);
 
    // fileObj.url = req.s3;

    await fetch(req.s3, {
        method: 'PUT',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        body: fileObj,
    })

}

module.exports = uploadURL;
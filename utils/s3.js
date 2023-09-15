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

async function uploadURL() {
    const rawBytes = await crypto.randomBytes(16);
    const fileName = rawBytes.toString('hex');

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 15 // link is available for 15 seconds.
    }

    return await s3.getSignedUrlPromise('putObject', params);
}

module.exports = uploadURL;
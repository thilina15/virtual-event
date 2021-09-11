if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()   
}

const aws = require('aws-sdk')

const s3 = new aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})
const bucketName = process.env.AWS_BUCKET_NAME

function fileUpload(file_image){
    return new Promise((resolve,reject)=>{
        if(file_image){
            var image = file_image[0]
        
            const params = {
                Bucket: bucketName,
                Key: Date.now() + image.originalname, 
                Body: image.buffer
            }
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(data.Location);
                resolve(data.Location) 
            })
        }
        else{
            reject()
        }
    })
    
}








module.exports = {
    s3, bucketName, fileUpload
}
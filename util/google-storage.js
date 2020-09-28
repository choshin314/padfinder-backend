const {Storage} = require('@google-cloud/storage');
const HttpError = require('../models/http-error')

const bucketName = 'padfinder2_bucket';

const storage = new Storage({keyFilename: 'google-storage-credentials.json', projectId: 'padfinder-2'});

async function uploadFile(file, next) {
    try {
        await storage.bucket(bucketName).upload(file, {
            gzip: true
        })
    } catch(err) {
        console.log(err.message)
        const error = new HttpError('Could not upload photos to storage', 500);
        return next(error)
    }
}

async function deleteFiles(filenames, next) {
    try {
        for(let filename of filenames) {
            await storage.bucket(bucketName).file(filename).delete();
            console.log(`gs://${bucketName}/${filename} deleted.`);
        }
    } catch(err) {
        console.log(err.message)
        const error = new HttpError('Could not delete photos from storage', 500);
        return next(error);
    }
}

async function uploadFileStream(file, next) {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.name);
    const stream = blob.createWriteStream({
        metadata: {
            contentType: blob.mimetype
        }
    });

    stream.on('error', err => {
        blob.cloudStorageError = err;
        const error = new HttpError(err.message, 500);
        return next(error);
    })

   stream.on('finish', () => {
        console.log('uploaded ', blob.name)
   }) 

   stream.end(file.data)
}

module.exports = { uploadFile, deleteFiles, uploadFileStream, bucketName }
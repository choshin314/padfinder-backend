const {Storage} = require('@google-cloud/storage');
const HttpError = require('../models/http-error')

const bucketName = 'padfinder2_bucket';

const storage = new Storage({keyFilename: 'googleStorageCredentials.json', projectId: 'padfinder-2'});

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

module.exports = { uploadFile, deleteFiles, bucketName }
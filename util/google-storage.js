const {Storage} = require('@google-cloud/storage');

const bucketName = 'padfinder_bucket';

const storage = new Storage({keyFilename: 'padfinder-b291a4ddddbc.json', projectId: 'padfinder'});

async function uploadFile(file) {
    await storage.bucket(bucketName).upload(file, {
        gzip: true
    })
}

async function deleteFiles(filenames) {
    for(let filename of filenames) {
        await storage.bucket(bucketName).file(filename).delete();
        console.log(`gs://${bucketName}/${filename} deleted.`);
    }
}

module.exports = { uploadFile, deleteFiles }
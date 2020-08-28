const {Storage} = require('@google-cloud/storage');

const bucketName = 'padfinder_bucket';

const storage = new Storage({keyFilename: 'padfinder-b291a4ddddbc.json', projectId: 'padfinder'});

async function uploadFile(file) {
    await storage.bucket(bucketName).upload(file, {
        gzip: true
    })
}

module.exports = uploadFile
const fs = require('fs');
fs.writeFile('./google-storage-credentials.json', process.env.GOOGLE_STORAGE_CREDENTIALS, (err) => {});
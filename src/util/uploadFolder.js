const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bucketName = 'calligo'; // Replace with your bucket name
const directoryPath = './src/public/'; // Replace with your folder's local path

function uploadDirectory(dirPath, bucket, keyPrefix = '') {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const fileKey = path.join(keyPrefix, file);

    if (fs.statSync(filePath).isDirectory()) {
      uploadDirectory(filePath, bucket, fileKey);
    } else {
      const command = `wrangler r2 object put ${bucket}/${fileKey} --file "${filePath}"`;
      try {
        console.log(`Uploading ${fileKey}...`);
        execSync(command);
        console.log(`Uploaded ${fileKey}`);
      } catch (error) {
        console.error(`Error uploading ${fileKey}: `, error);
      }
    }
  });
}

uploadDirectory(directoryPath, bucketName);

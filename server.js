require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
const port = 18080;

// Multer config
const upload = multer({ dest: 'uploads/' });

// AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const fileContent = fs.readFileSync(req.file.path);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: fileContent,
    ContentType: req.file.mimetype,
    ContentDisposition: 'inline'  // <-- This makes the file open in browser
  };

  s3.upload(params, (err, data) => {    
    fs.unlinkSync(req.file.path); // delete local file

    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    console.log('✅ Uploaded to S3:', data.Location);
    res.status(200).json({ url: data.Location });
  });
});


// List files endpoint
app.get('/files', (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error('❌ List error:', err);
      return res.status(500).json({ error: 'Could not list files' });
    }

    const files = (data.Contents || []).map(file => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
    }));

    res.status(200).json({ files });
  });
});

// Delete file endpoint
app.delete('/delete/:key', (req, res) => {
  const key = req.params.key;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('❌ Delete error:', err);
      return res.status(500).json({ error: 'Could not delete file' });
    }

    console.log('🗑️ Deleted from S3:', key);
    res.status(200).json({ message: 'File deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import AppError from './AppError.js';

// 1. Initialize the S3 Client (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2. Configure Multer to store the file temporarily in memory (RAM)
const multerStorage = multer.memoryStorage();

// 3. Filter to only accept images (for bus photos)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// 4. The function that actually pushes the file buffer to AWS S3
export const uploadToS3 = async (file) => {
  // Generate a unique filename: e.g., bus-photo-uuid.jpg
  const ext = path.extname(file.originalname);
  const filename = `bus-photo-${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Makes the image publicly viewable via URL
  });

  await s3.send(command);

  // Return the public URL so we can save it in PostgreSQL
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
};
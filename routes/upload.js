const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename files to prevent conflicts
  }
});
const upload = multer({ storage: storage });

// File Filter (Optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') { // Allow only CSV files
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

// middleware
router.use(bodyParser.urlencoded({ extended: true })); // add body parser middleware to parse form data

// Upload Route
router.post('/', upload.single('csv'), uploadController.handleUpload);


// Error Handling Middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).send({ error: err.message }); // Bad Request
  } else if (err) {
    // An unknown error occurred when uploading.
    console.error(err);
    res.status(500).send({ error: 'An unknown error occurred' }); // Internal Server Error
  }
});

module.exports = router;

const fs = require('fs');
const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const path = require('path');

// Download Route
router.get('/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join('downloads', filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ error: 'File not found.' });
    }
    next(); // File exists, proceed to download
  });
}, downloadController.handleDownload);


// Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).send({ error: 'An error occurred during download.' });
});

module.exports = router;

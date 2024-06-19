const fs = require('fs');
const path = require('path');

function handleDownload(req, res) {
  const filename = req.params.filename;
  const filePath = path.join('downloads', filename);

  // Set appropriate headers for download
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/csv'); 

  // Stream the file to the user
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  // Handle errors during streaming
  fileStream.on('error', (err) => {
    console.error('Error reading file:', err);
    res.status(500).send({ error: 'An error occurred during download.' });
  });
}

module.exports = {
  handleDownload
};

const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling Middleware (Example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the Server
const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

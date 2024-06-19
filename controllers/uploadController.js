const csv = require('csv-parse');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

function truncateString(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text; // If the string is short enough, return it as is
  } else {
    return text.slice(0, maxLength); // Otherwise, take the first 100 characters and add an ellipsis
  }
}

async function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded.' });
  }

  const filePath = req.file.path;

  // 1. Parse the CSV File
  const parser = csv.parse({ columns: true }); // Assuming first row is header
  let records = [];
  let index = 1;

  parser.on('readable', function(){
    let record;
    const shopUrl = req.body.shopUrl;
    while (record = parser.read()) {
      records.push({
        // 2. Map Shopify data to Facebook fields
        id: `${truncateString(record['Handle'].toLowerCase(), 95)}_${index}`,       // Assuming your Shopify CSV has a 'Handle' column
        title: record['Title'], 
        description: record['Body (HTML)'],
        availability: record['Variant Inventory Qty'] > 0 ? 'in stock' : 'out of stock',
        condition: 'new',          // Assuming all products are new
        price: record['Variant Price'],
        link: `${shopUrl}/products/${record['Handle']}`,
        image_link: record['Image Src'],
        brand: record['Vendor'],
        // Add more mappings as needed
      });

      index += 1;
    }
  });

  parser.on('end', async function() {
    const currentTime = + new Date()
    // 3. Create the Facebook Catalog CSV
    const csvWriter = createCsvWriter({
      path: path.join('downloads', `facebook_catalog_${currentTime}.csv`),
      header: [
        { id: 'id', title: 'id' },
        { id: 'title', title: 'title' },
        { id: 'description', title: 'description' },
        { id: 'availability', title: 'availability' },
        { id: 'condition', title: 'condition' },
        { id: 'price', title: 'price' },
        { id: 'link', title: 'link' },
        { id: 'image_link', title: 'image_link' },
        { id: 'brand', title: 'brand' },
        // ... add other Facebook required fields
      ],
    });

    await csvWriter.writeRecords(records);

    // 4. Clean Up (Optional)
    fs.unlink(filePath, (err) => { 
      if (err) console.error(err);
    });

    // 5. Send Download Link
    // res.send({ downloadLink: '/download/facebook_catalog.csv' }); 
    // Send Download Link
    res.json({ downloadLink: `/download/facebook_catalog_${currentTime}.csv` }); // Send JSON response
  });

  fs.createReadStream(filePath).pipe(parser);
}

module.exports = {
  handleUpload,
};

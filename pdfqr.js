const express = require('express');
const puppeteer = require('puppeteer');
const qr = require('qrcode');
const fs = require('fs');

const app = express();

// Serve HTML page for visitors to choose design and enter name
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Generate PDF and QR code
app.post('/generate', async (req, res) => {
  // Generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  // Save PDF on server
  fs.writeFileSync('certificate.pdf', pdfBuffer);

  // Generate QR code
  const qrCodeURL = 'http://localhost:3000/certificate.pdf';
  const qrCodeImage = await qr.toDataURL(qrCodeURL);

  res.json({ qrCode: qrCodeImage });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

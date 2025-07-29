var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GENERATE IMAGE
router.get('/generate-image', (req, res) => {
  res.render('form', { imageUrl: null });
});

router.post('/generate-image', async (req, res) => {
  const { width, height, blur, grayscale } = req.body;

  if (!width || !height) {
    return res.status(400).send('Width and height are required.');
  }

  try {
    let url = `https://picsum.photos/${width}/${height}`;
    const params = [];

    if (grayscale) params.push('grayscale');
    if (blur && Number(blur) > 0) params.push(`blur=${blur}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    res.render('form', { imageUrl: url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating image URL.');
  }
});

//GENERATE QR CODES
router.get('/generate-qr-code', (req, res) => {
  res.render('qrCode', { imageUrl: null });
});

router.post('/generate-qr-code', async (req, res) => {
  const { width, height, value } = req.body;
  console.log(req.body);

  if (!width || !height || !value) {
    return res.status(400).send('Width, height, and value are required.');
  }

  try {
    const encodedValue = encodeURIComponent(value); // replaces spaces with %20, etc.

    const url = `https://image-charts.com/chart?chs=${width}x${height}&cht=qr&chl=${encodedValue}&choe=UTF-8`;

    res.render('qrCode', {
      qrUrl: url,
      width,
      height,
      value
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code.');
  }
});


module.exports = router;

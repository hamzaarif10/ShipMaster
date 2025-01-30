const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch rate from Easy ship API
router.post('/get-easyship-rate', async (req, res) => {
  try {
    const url = 'https://public-api.easyship.com/2024-09/rates';

    const response = await axios.post(url, req.body, {
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer prod_webN4zgI8huDvbnChzuu8PdPTFFIHB/Lw5vYxymHLzo='
          }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Failed to fetch rate from GLS API' });
  }
});

//Fetch tracking number and shipping label etc from easyship api
router.post('/get-easyship-label', async (req, res) => {
  try {
    const url = 'https://public-api.easyship.com/2024-09/shipments';
    const response = await axios.post(url, req.body, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer prod_webN4zgI8huDvbnChzuu8PdPTFFIHB/Lw5vYxymHLzo='
      }
    });
    res.json(response.data);
  }catch(error){
    console.error('Error making the api call to easyship and creating shipping label:', error);
    res.status(500).json({ error: 'Failed to create shipping label from eashyship api' });
  }
});

//Fetch rate from GLS api
router.post('/get-gls-rate', async (req, res) => {
  try {
    const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
    const url = 'https://smart4i.gls-canada.com/v1/rate?rateType=NEG';

    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Failed to fetch rate from GLS API' });
  }
});
//Create Shipment Gls api
router.post('/create-gls-shipment', async (req, res) => {
  try {
    const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
    const url = 'https://smart4i.gls-canada.com/v1/shipment';

    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`,
      },
    });
    res.json(response.data);
  } catch (error)
  {
    console.error("Error Creating Gls Shipment.", error);
    res.status(500).json({ error: 'Failed to create shipment from GLS API' });
  }

})
//Fetch label from Gls api
router.get('/get-gls-label/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Label ID is required' });
    }

    const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
    const url = `https://smart4i.gls-canada.com/v1/shipment/label/${id}?idType=id&labelType=FourByFive&rotation=Default&mediaType=ThermalTransfert&zplSettings=Server&ZplEnableCutter=True`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Accept': 'application/pdf',
        'Content-Type': 'application/pdf',
      },
      responseType: 'arraybuffer',  // Get response as arraybuffer (to handle binary data)
    });
    if (response.data.length === 0) {
      return res.status(500).json({ error: 'Received empty data from GLS API' });
    }
    res.set({
      'Content-Type': 'application/pdf', 
      'Content-Disposition': response.headers['content-disposition'],
    });
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching label:', error);
    res.status(500).json({ error: 'Failed to fetch label from GLS API' });
  }
});


module.exports = router;

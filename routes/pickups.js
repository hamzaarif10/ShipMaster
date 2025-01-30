const express = require('express');
const axios = require('axios');

const router = express.Router();

//Make api call to eashship api and schedule pickup
router.post('/schedule-easyship-pickup', async (req, res) => {
  try {
    const url = 'https://public-api.easyship.com/2024-09/pickups';
    const response = await axios.post(url, req.body, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer prod_webN4zgI8huDvbnChzuu8PdPTFFIHB/Lw5vYxymHLzo='
      }
    });
    res.json(response.data);
  }catch(error){
    console.error('Error scheduling pickup:', error);
    res.status(500).json({ error: 'Failed to schedule pickup from the eashyship api' });
  }
});

module.exports = router;
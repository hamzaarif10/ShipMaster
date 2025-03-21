const express = require('express');
const axios = require('axios');

const router = express.Router();

//Fetch gls rate
router.post('/get-gls-rate', async (req, res) => {
  try {
    const url = 'https://secureship.ca/ship/api/v2/carriers/rates';

    const response = await axios.post(url, req.body, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': '39835d99-d7de-4b4d-8a6d-aa17ea6427ba'
          }
    });
    console.log('Response data:', response.data);  
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Failed to fetch rate from GLS API' });
  }
});
//Fetch tracking number and shipping label etc from gls api
router.post('/get-gls-label', async (req, res) => {
  try {
    const url = 'https://secureship.ca/ship/api/v1/carriers/create-label';
    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': '39835d99-d7de-4b4d-8a6d-aa17ea6427ba'
      }
    });
    console.log(response.data);
    res.json(response.data);
  }catch(error){
    console.error('Error making the api call to GLS and creating shipping label:', error);
    res.status(500).json({ error: 'Failed to create shipping label from GLS api' });
  }
});
router.get('/download-gls-label', async (req, res) => {
  try {
    const { shipment_id, documentSize } = req.query;
    

    if (!shipment_id) {
      return res.status(400).json({ error: 'shipment_id is required' });
    }

    const url = `https://secureship.ca/ship/api/v1/carriers/download/documents/${shipment_id}`;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': '39835d99-d7de-4b4d-8a6d-aa17ea6427ba'
      },
      params: {
        documentSize 
      },
      responseType: 'arraybuffer' // Expect binary data
    });

    // Convert binary data to base64
    const base64String = Buffer.from(response.data, 'binary').toString('base64');

    res.json({ base64String });
  } catch (error) {
    console.error('Error fetching the shipping label:', error);
    res.status(500).json({ error: 'Failed to fetch shipping label' });
  }
});
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

// //Fetch rate from GLS api
// router.post('/get-gls-rate', async (req, res) => {
//   try {
//     const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
//     const url = 'https://smart4i.gls-canada.com/v1/rate?rateType=NEG';

//     const response = await axios.post(url, req.body, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${base64Credentials}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching rate:', error);
//     res.status(500).json({ error: 'Failed to fetch rate from GLS API' });
//   }
// });
// //Create Shipment Gls api
// router.post('/create-gls-shipment', async (req, res) => {
//   try {
//     const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
//     const url = 'https://smart4i.gls-canada.com/v1/shipment';

//     const response = await axios.post(url, req.body, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${base64Credentials}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error)
//   {
//     console.error("Error Creating Gls Shipment.", error);
//     res.status(500).json({ error: 'Failed to create shipment from GLS API' });
//   }

// })
// //Fetch label from Gls api
// router.get('/get-gls-label/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: 'Label ID is required' });
//     }

//     const base64Credentials = Buffer.from(process.env.GLS_CREDENTIALS).toString('base64');
//     const url = `https://smart4i.gls-canada.com/v1/shipment/label/${id}?idType=id&labelType=FourByFive&rotation=Default&mediaType=ThermalTransfert&zplSettings=Server&ZplEnableCutter=True`;

//     const response = await axios.get(url, {
//       headers: {
//         'Authorization': `Basic ${base64Credentials}`,
//         'Accept': 'application/pdf',
//         'Content-Type': 'application/pdf',
//       },
//       responseType: 'arraybuffer',  // Get response as arraybuffer (to handle binary data)
//     });
//     if (response.data.length === 0) {
//       return res.status(500).json({ error: 'Received empty data from GLS API' });
//     }
//     res.set({
//       'Content-Type': 'application/pdf', 
//       'Content-Disposition': response.headers['content-disposition'],
//     });
//     res.send(response.data);
//   } catch (error) {
//     console.error('Error fetching label:', error);
//     res.status(500).json({ error: 'Failed to fetch label from GLS API' });
//   }
// });


module.exports = router;
